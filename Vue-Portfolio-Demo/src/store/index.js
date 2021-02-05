import Vue from 'vue';
import Vuex from 'vuex';
import content from '@/data/content.json';
import {
  LOAD_ASSETS,
  LOAD_ASSETS_PROGRESS,
  LOAD_ASSETS_LOADED,
  SWITCH_OBJECT,
  SWITCH_CURSOR_STATE,
  SWITCH_PREVIOUS_STAGE_CLICK,
  SWITCH_NEXT_STAGE_CLICK,
  SWITCH_CURRENT_STAGE,
  SWITCH_STAGE_TRANSITION_DIRECTION,
  SWITCH_CENTER_GAP,
  SWITCH_CENTER_GAP_DOWN,
  SWITCH_LIST_ACTIVE,
  SWITCH_PROJECT_ACTIVE,
  SWITCH_CURRENT_SCROLL,
  SWITCH_ABOUT_ACTIVE,
  SWITCH_WEBSITE_READY
} from '@/store/types';
import ProgressLoader from '@/services/ProgressLoader';

Vue.use(Vuex);

const state = {
  content,
  assetsLoadingProgress: 0,
  assetsLoaded: false,
  websiteReady: false,
  object: null,
  currentScroll: 0,
  cursorState: 'normal',
  currentStage: 1,
  previousStage: null,
  stageTransitionDirection: 1,
  previousStageClick: 0,
  nextStageClick: 0,
  listActive: false,
  projectActive: false,
  aboutActive: false,
  centerGap: {
    x: 0,
    y: 0
  },
  centerGapDown: 0
};

const mutations = {
  [SWITCH_WEBSITE_READY](state, value) {
    state.websiteReady = value;
  },
  [SWITCH_ABOUT_ACTIVE](state, value) {
    state.aboutActive = value;
  },
  [SWITCH_CURRENT_SCROLL](state, value) {
    state.currentScroll = value;
  },
  [SWITCH_PROJECT_ACTIVE](state, value) {
    state.projectActive = value;
  },
  [SWITCH_LIST_ACTIVE](state, value) {
    state.listActive = value;
  },
  [SWITCH_CENTER_GAP_DOWN](state, centerGapDown) {
    state.centerGapDown = centerGapDown;
  },
  [SWITCH_CENTER_GAP](state, centerGap) {
    state.centerGap = centerGap;
  },
  [SWITCH_STAGE_TRANSITION_DIRECTION](state, direction) {
    state.stageTransitionDirection = direction;
  },
  [SWITCH_PREVIOUS_STAGE_CLICK](state) {
    state.previousStageClick += 1;
  },
  [SWITCH_NEXT_STAGE_CLICK](state) {
    state.nextStageClick += 1;
  },
  [LOAD_ASSETS_PROGRESS](state, progress) {
    state.assetsLoadingProgress = progress;
  },
  [LOAD_ASSETS_LOADED](state) {
    state.assetsLoaded = true;
  },
  [SWITCH_OBJECT](state, object) {
    state.object = object;
  },
  [SWITCH_CURRENT_STAGE](state, stage) {
    state.previousStage = state.currentStage;
    state.currentStage = stage;
  },
  [SWITCH_CURSOR_STATE](state, cursorState) {
    if (cursorState === 'normal' || cursorState === 'pressed') {
      state.cursorState = cursorState;
    } else {
      console.error(`Unknown cusorState "${cursorState}"`);
    }
  }
};

const actions = {
  [LOAD_ASSETS]: ({ commit, state }) => {
    const progressLoaderService = new ProgressLoader(
      state.content.assets,
      content.model,
      commit
    );
    progressLoaderService.on('progress', progress => {
      commit(LOAD_ASSETS_PROGRESS, progress);
    });
    progressLoaderService.on('complete', () => {
      commit(LOAD_ASSETS_PROGRESS, 100);
      commit(LOAD_ASSETS_LOADED);
    });
  }
};

const getters = {};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
