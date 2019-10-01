class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) throw new Error("missing config!");
    this.initialState = config.initial;
    this.currentState = config.initial;
    this.states = config.states;
    this.stateStack = [this.currentState];
    this.historyStates = [];
    this.reversible;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.currentState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    const stateKeys = Object.keys(this.states);
    if (!stateKeys.includes(state)) throw new Error("this state missing!");
    this.currentState = state;
    this.stateStack.push(this.currentState);
    this.reversible = false;
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.states[this.currentState].transitions[event]) {
      const changeState = this.states[this.currentState].transitions[event];
      this.currentState = changeState;
      this.stateStack.push(changeState);
      this.reversible = false;
    } else {
      throw new Error("event missing!");
    }
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.currentState = this.initialState;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    const stateKeys = Object.keys(this.states);
    const transitionEventStates = [];
    if (!event) {
      return stateKeys;
    }

    stateKeys.forEach(key => {
      if (this.states[key].transitions[event]) {
        transitionEventStates.push(key);
      }
    });
    return transitionEventStates;
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.stateStack.length < 2) {
      return false;
    }
    this.historyStates.push(this.stateStack.pop());
    this.currentState = this.stateStack[this.stateStack.length - 1];
    this.reversible = true;
    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (!this.reversible || !this.historyStates.length) {
      return false;
    }
    const lastHistoryState = this.historyStates.pop();
    this.currentState = lastHistoryState;
    this.stateStack.push(lastHistoryState);
    if (this.historyStates) {
      return true;
    }
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.activeState = this.initialState;
    this.stateStack = ["normal"];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
