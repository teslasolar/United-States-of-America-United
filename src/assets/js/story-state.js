/**
 * Story State Management
 * Handles localStorage persistence, progress tracking, and bookmarks
 */

const STORAGE_KEY = 'usau-story-state';
const PATH_PREFIX = '/United-States-of-America-United';

// Initialize Alpine.js store
document.addEventListener('alpine:init', () => {
  Alpine.store('story', {
    // State
    currentNode: null,
    visitedNodes: [],
    choices: {},
    consequences: [],
    bookmarks: [],
    startedAt: null,
    lastPlayed: null,
    playTime: 0,

    // Initialize from localStorage or create new
    init(startNode = 'prologue/001-opening') {
      const saved = this.loadState();
      if (saved) {
        Object.assign(this, saved);
        this.lastPlayed = new Date().toISOString();
      } else {
        this.currentNode = startNode;
        this.startedAt = new Date().toISOString();
        this.lastPlayed = this.startedAt;
      }
      this.saveState();
    },

    // Navigate to a node
    visitNode(nodeId) {
      if (!this.visitedNodes.includes(nodeId)) {
        this.visitedNodes.push(nodeId);
      }
      this.currentNode = nodeId;
      this.lastPlayed = new Date().toISOString();
      this.saveState();

      // Update URL without reload
      if (history.pushState) {
        const newUrl = `${PATH_PREFIX}/story/${nodeId}/`;
        history.pushState({nodeId}, '', newUrl);
      }
    },

    // Make a choice at a decision point
    makeChoice(decisionNodeId, choiceId, nextNodeId, consequences = []) {
      // Record the choice
      this.choices[decisionNodeId] = choiceId;

      // Add consequences
      consequences.forEach(consequence => {
        if (!this.consequences.includes(consequence)) {
          this.consequences.push(consequence);
        }
      });

      this.saveState();

      // Navigate to next node
      if (nextNodeId) {
        window.location.href = `${PATH_PREFIX}/story/${nextNodeId}/`;
      }
    },

    // Check if player has a consequence
    hasConsequence(consequenceId) {
      return this.consequences.includes(consequenceId);
    },

    // Check if player has visited a node
    hasVisited(nodeId) {
      return this.visitedNodes.includes(nodeId);
    },

    // Get choice made at a decision node
    getChoice(nodeId) {
      return this.choices[nodeId] || null;
    },

    // Calculate progress percentage
    getProgress(totalNodes) {
      if (!totalNodes) return 0;
      return Math.round((this.visitedNodes.length / totalNodes) * 100);
    },

    // Bookmark management
    addBookmark(nodeId, label = null) {
      const bookmark = {
        id: `bookmark-${Date.now()}`,
        nodeId,
        label: label || `Bookmark at ${nodeId}`,
        timestamp: new Date().toISOString(),
        choices: {...this.choices},
        consequences: [...this.consequences],
        visitedNodes: [...this.visitedNodes]
      };

      this.bookmarks.push(bookmark);
      this.saveState();
      return bookmark;
    },

    loadBookmark(bookmarkId) {
      const bookmark = this.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        this.currentNode = bookmark.nodeId;
        this.choices = {...bookmark.choices};
        this.consequences = [...bookmark.consequences];
        this.visitedNodes = [...bookmark.visitedNodes];
        this.saveState();
        window.location.href = `${PATH_PREFIX}/story/${bookmark.nodeId}/`;
      }
    },

    deleteBookmark(bookmarkId) {
      this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
      this.saveState();
    },

    // Get statistics
    getStats() {
      return {
        nodesVisited: this.visitedNodes.length,
        decisionsMade: Object.keys(this.choices).length,
        consequencesEarned: this.consequences.length,
        bookmarksCreated: this.bookmarks.length,
        playTime: this.playTime,
        startedAt: this.startedAt,
        lastPlayed: this.lastPlayed
      };
    },

    // Export state as JSON
    exportState() {
      const state = {
        currentNode: this.currentNode,
        visitedNodes: this.visitedNodes,
        choices: this.choices,
        consequences: this.consequences,
        bookmarks: this.bookmarks,
        startedAt: this.startedAt,
        lastPlayed: this.lastPlayed,
        playTime: this.playTime
      };
      return JSON.stringify(state, null, 2);
    },

    // Import state from JSON
    importState(jsonString) {
      try {
        const state = JSON.parse(jsonString);
        Object.assign(this, state);
        this.saveState();
        return true;
      } catch (e) {
        console.error('Failed to import state:', e);
        return false;
      }
    },

    // Restart story
    restart(startNode = 'prologue/001-opening') {
      if (confirm('Are you sure you want to restart? This will erase your current progress.')) {
        this.currentNode = startNode;
        this.visitedNodes = [];
        this.choices = {};
        this.consequences = [];
        this.startedAt = new Date().toISOString();
        this.lastPlayed = this.startedAt;
        this.playTime = 0;
        // Don't clear bookmarks - keep them as save points
        this.saveState();
        window.location.href = `${PATH_PREFIX}/story/${startNode}/`;
      }
    },

    // Undo last choice (go back one node)
    undoLastChoice() {
      if (this.visitedNodes.length > 1) {
        // Get the previous node
        this.visitedNodes.pop(); // Remove current
        const previousNode = this.visitedNodes[this.visitedNodes.length - 1];

        // Remove the last choice
        const lastDecisionNodes = Object.keys(this.choices).filter(nodeId =>
          this.visitedNodes.includes(nodeId)
        );
        if (lastDecisionNodes.length > 0) {
          const lastDecision = lastDecisionNodes[lastDecisionNodes.length - 1];
          delete this.choices[lastDecision];
        }

        this.currentNode = previousNode;
        this.saveState();
        window.location.href = `${PATH_PREFIX}/story/${previousNode}/`;
      }
    },

    // Save to localStorage
    saveState() {
      const state = {
        currentNode: this.currentNode,
        visitedNodes: this.visitedNodes,
        choices: this.choices,
        consequences: this.consequences,
        bookmarks: this.bookmarks,
        startedAt: this.startedAt,
        lastPlayed: this.lastPlayed,
        playTime: this.playTime
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    },

    // Load from localStorage
    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        console.error('Failed to load state:', e);
        return null;
      }
    },

    // Clear all saved data
    clearState() {
      if (confirm('Are you sure you want to delete ALL saved data including bookmarks?')) {
        localStorage.removeItem(STORAGE_KEY);
        this.init();
      }
    }
  });
});

// Track time spent (update every 30 seconds)
setInterval(() => {
  const store = Alpine.store('story');
  if (store) {
    store.playTime += 30;
    store.saveState();
  }
}, 30000);

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.nodeId) {
    const store = Alpine.store('story');
    if (store) {
      store.currentNode = event.state.nodeId;
      // Note: This will reload the page, which is fine
      location.reload();
    }
  }
});
