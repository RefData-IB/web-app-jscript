import { combineReducers } from "redux";
import search from "./searchReducer";
import registration from "./registrationReducer";
import metadata from "./metadataReducer";
import subjectProfile from "./subjectDashboardReducer";
import subjectGenerel from "./generalSubjectDashboardReducer";
import subjectProgram from "./programSubjectDashboardReducer";
import programs from "./programReducer";
import enrolmentReducer from "./programEnrolReducer";
import viewVisitReducer from "./viewVisitReducer";
import completedVisitsReducer from "./completedVisitsReducer";
import programEncounterReducer from "./programEncounterReducer";
import relations from "./relationshipReducer";
import encounterReducer from "./encounterReducer";
import loadReducer from "./loadReducer";
import searchFilterReducer from "./searchFilterReducer";
import rulesReducer from "./RulesReducer";
import serverSideRulesReducer from "./serverSideRulesReducer";

export default combineReducers({
  search,
  registration,
  metadata,
  subjectProfile,
  subjectGenerel,
  subjectProgram,
  programs,
  enrolmentReducer,
  viewVisitReducer,
  completedVisitsReducer,
  programEncounterReducer,
  relations,
  encounterReducer,
  loadReducer,
  searchFilterReducer,
  rulesReducer,
  serverSideRulesReducer
});
