import React from "react"
import MaterialCheckbox from "material-ui/Checkbox"

const Checkbox = props => (
  <MaterialCheckbox
    label={props.label}
    checked={props.checked}
    onCheck={props.onClick}
  />
)

export default Checkbox
