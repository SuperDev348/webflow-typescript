import * as React from "react";

import { BlockData, AirtableRecord, QualifierTypes, ExpressionTypes, CriteriaTypes, CardData, ContactMethodData, FilterTypes, BundleType, ProtocolType } from '../types'

type BuilderStateType = {
  bundleId: string,
  protocolId: string,
  bundles: BundleType[],
  protocols: ProtocolType[],
  blocks: BlockData[],
  propertyData: CardData,
  cards: CardData[],
  dosages: AirtableRecord[],
  tests: AirtableRecord[],
  findings: AirtableRecord[],
  keypoints: AirtableRecord[],
  diseases: AirtableRecord[],
  specialties: AirtableRecord[],
  pathways: AirtableRecord[],
  calculators: AirtableRecord[],
  references: AirtableRecord[],
  periods: AirtableRecord[],
  handouts: AirtableRecord[],
  presentations: AirtableRecord[],
  qualifiers: QualifierTypes[],
  expressions: ExpressionTypes[],
  criterias: CriteriaTypes[],
  contact_methods: ContactMethodData[],
  filters: {
    qn: FilterTypes[],
    nom: FilterTypes[],
    date: FilterTypes[],
    set: FilterTypes[],
    ord: FilterTypes[]
  }
}
const initBuilderState = {
  bundleId: "",
  protocolId: "",
  bundles: [],
  protocols: [],
  blocks: [],
  propertyData: {} as CardData,
  cards: [],
  dosages: [],
  tests: [],
  findings: [],
  keypoints: [],
  diseases: [],
  specialties: [],
  pathways: [],
  calculators: [],
  references: [],
  periods: [],
  handouts: [],
  presentations: [],
  qualifiers: [],
  expressions: [],
  criterias: [],
  contact_methods: [],
  filters: {
    qn: [],
    nom: [],
    date: [],
    set: [],
    ord: []
  }
}
type BuilderContextType = {
  builderState: BuilderStateType;
  dispatch: React.Dispatch<any>;
}
const initialState = {
  builderState: initBuilderState,
  dispatch: () => null
}
const BuilderContext = React.createContext<BuilderContextType>(initialState);

function builderReducer(state, action) {
  switch (action.type) {
    case "SET": {
      return { ...state, [action.settingName]: action.settingData };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export const BuilderProvider = (props) => {
  const [builderState, dispatch] = React.useReducer(builderReducer, initBuilderState);
  return <BuilderContext.Provider value={{ builderState, dispatch }} {...props} />;
};

export const useBuilder = () => {
  const context = React.useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
