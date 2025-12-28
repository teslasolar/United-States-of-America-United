const fs = require('fs');
const path = require('path');

module.exports = function() {
  const storyJsonPath = path.join(__dirname, '../story/story.json');

  // Load story.json if it exists
  let storyData = {
    nodes: {},
    themes: {},
    historicalDivergence: {}
  };

  if (fs.existsSync(storyJsonPath)) {
    const rawData = fs.readFileSync(storyJsonPath, 'utf-8');
    storyData = JSON.parse(rawData);
  }

  // Build adjacency list for navigation
  const graph = {};
  const nodesList = [];

  for (const [nodeId, nodeData] of Object.entries(storyData.nodes || {})) {
    graph[nodeId] = {
      ...nodeData,
      edges: []
    };

    // Add to nodes list
    nodesList.push({
      id: nodeId,
      ...nodeData
    });

    // Build edges from nextNode
    if (nodeData.nextNode) {
      graph[nodeId].edges.push(nodeData.nextNode);
    }

    // Build edges from choices
    if (nodeData.choices && Array.isArray(nodeData.choices)) {
      nodeData.choices.forEach(choice => {
        if (choice.nextNode) {
          graph[nodeId].edges.push(choice.nextNode);
        }
      });
    }
  }

  // Calculate reachable endings from each node
  function getReachableEndings(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);

    const node = graph[nodeId];
    if (!node) return [];

    if (node.type === 'ending') {
      return [nodeId];
    }

    const endings = [];
    node.edges.forEach(edge => {
      endings.push(...getReachableEndings(edge, visited));
    });

    return [...new Set(endings)];
  }

  // Add reachable endings to each node
  for (const nodeId of Object.keys(graph)) {
    graph[nodeId].reachableEndings = getReachableEndings(nodeId);
  }

  // Group nodes by era
  const eras = {};
  nodesList.forEach(node => {
    const era = node.era || 'unknown';
    if (!eras[era]) {
      eras[era] = [];
    }
    eras[era].push(node);
  });

  // Create timeline events sorted by year
  const timeline = nodesList
    .filter(node => node.year)
    .map(node => ({
      id: node.id,
      title: node.title,
      year: node.year,
      era: node.era,
      type: node.type
    }))
    .sort((a, b) => {
      // Extract first year from ranges like "1900-1945"
      const getFirstYear = (yearStr) => {
        const match = yearStr.toString().match(/(\d{4})/);
        return match ? parseInt(match[1]) : 0;
      };
      return getFirstYear(a.year) - getFirstYear(b.year);
    });

  // Validate graph integrity
  const warnings = [];

  // Check for orphaned nodes (nodes that aren't referenced by any other node)
  const referencedNodes = new Set();
  Object.values(graph).forEach(node => {
    node.edges.forEach(edge => referencedNodes.add(edge));
  });

  Object.keys(graph).forEach(nodeId => {
    const node = graph[nodeId];

    // Warn if node has no outgoing edges and isn't an ending
    if (node.edges.length === 0 && node.type !== 'ending') {
      warnings.push(`Node "${nodeId}" has no next node and is not marked as an ending`);
    }

    // Warn if node is orphaned (not the start node and not referenced)
    if (nodeId !== storyData.startNode && !referencedNodes.has(nodeId)) {
      warnings.push(`Node "${nodeId}" is orphaned (not reachable from any other node)`);
    }

    // Warn if referenced node doesn't exist
    node.edges.forEach(edge => {
      if (!graph[edge]) {
        warnings.push(`Node "${nodeId}" references non-existent node "${edge}"`);
      }
    });
  });

  return {
    title: storyData.title || 'Untitled Story',
    subtitle: storyData.subtitle || '',
    author: storyData.author || '',
    version: storyData.version || '1.0.0',
    startNode: storyData.startNode || Object.keys(graph)[0] || null,
    historicalDivergence: storyData.historicalDivergence || {},
    themes: storyData.themes || {},
    graph,
    nodes: nodesList,
    eras,
    timeline,
    stats: {
      totalNodes: nodesList.length,
      decisions: nodesList.filter(n => n.type === 'decision').length,
      endings: nodesList.filter(n => n.type === 'ending').length,
      storyNodes: nodesList.filter(n => n.type === 'story').length
    },
    validation: {
      isValid: warnings.length === 0,
      warnings
    }
  };
};
