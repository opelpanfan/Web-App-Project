import { types } from "../actions"
import fields from "./fields-data"

let initialIndustry = window.localStorage.getItem("industry")

const fields_not_for_display = ["active", "Industry"]
const initialState = {
  db_fields: fields[initialIndustry]
    ? {
        private: fields[initialIndustry].private
          .filter(field => field.editable)
          .map(field => ({ key: field.key, name: field.name }))
          .filter(f => !fields_not_for_display.includes(f.key)),
        public: fields[initialIndustry].public
          .filter(field => field.editable)
          .map(field => ({ key: field.key, name: field.name }))
          .filter(f => !fields_not_for_display.includes(f.key)),
      }
    : undefined,
  values: {
    Industry: initialIndustry,
  },
  errors: {},
  agree_to_terms: false,
  loading: false,
}

let newErrors = null
export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADD_LEAD_FORM_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.error.name]: action.error.value,
        },
      }

    case types.ADD_LEAD_AGREE_TO_TERMS:
      newErrors = { ...state.errors }
      delete newErrors["agree_to_terms"]
      return {
        ...state,
        errors: newErrors,
        agree_to_terms: action.agree_to_terms.value,
      }

    case types.ADD_LEAD_LOADING_START:
      return {
        ...state,
        loading: true,
      }

    case types.ADD_LEAD_LOADING_END:
      return {
        ...state,
        loading: false,
      }

    case types.ADD_LEAD_CLEAR_FORM:
      return {
        ...state,
        values: {
          Industry: initialIndustry,
        },
        errors: {},
        agree_to_terms: false,
      }

    case types.ADD_LEAD_HANDLE_FORM_CHANGE:
      newErrors = { ...state.errors }
      switch (action.payload.name) {
        case "Telephone":
        case "Email":
        case "Contact Person":
          delete newErrors.Telephone
          delete newErrors.Email
          delete newErrors["Contact Person"]
          break
        default:
          delete newErrors[action.payload.name]
          break
      }
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
        errors: newErrors,
      }

    case types.INDUSTRY_UPDATE:
      initialIndustry = action.payload
      return {
        ...state,
        db_fields: fields[action.payload]
          ? {
              private: fields[action.payload].private
                .filter(field => field.editable)
                .map(field => ({ key: field.key, name: field.name }))
                .filter(f => !fields_not_for_display.includes(f.key)),
              public: fields[action.payload].public
                .filter(field => field.editable)
                .map(field => ({ key: field.key, name: field.name }))
                .filter(f => !fields_not_for_display.includes(f.key)),
            }
          : undefined,
        values: {
          Industry: action.payload,
        },
      }
    default:
      return state
  }
}
