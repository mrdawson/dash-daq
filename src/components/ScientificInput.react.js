import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import LabelContainer from '../styled/shared/LabelContainer.styled';

import sci from '../helpers/scientific';
import { light, colors } from '../styled/constants';
import { getClassName, getFilteredProps } from '../helpers/classNameGenerator';

/**
 * SciNumInput is a numeric input with scientific suffixes.
 */
class ScientificInput extends Component {
  constructor(props) {
    super(props);
    let [significand, magnitude] = sci.numToScientific(props.value);
    // this.props.setProps({
    //     ...this.props,
    //     significand: significand,
    //     magnitude: magnitude
    // });
    this.state = {
      value: props.value,
      significand: significand,
      magnitude: magnitude
    };
    this.setValue = this.setValue.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.value !== this.state.value) this.setState({ value: newProps.value });
  }

  setValue(event) {
    const name = event.target.name;
    const value = event.target.value;
    let significand = this.state.significand;
    let magnitude = this.state.magnitude;

    if (name === 'significand') significand = Number(value);
    if (name === 'magnitude') magnitude = Number(value);

    let new_val = significand * Math.pow(10, magnitude) || 0;
    this.setState({
      ...this.state,
      value: new_val,
      significand: significand,
      magnitude: magnitude
    });
    if (this.props.setProps) {
      this.props.setProps({
        ...this.props,
        value: new_val,
        significand: significand,
        magnitude: magnitude
      });
    }
  }

  render() {
    const { size, theme, style, className, id, disabled, significand, baseUnit } = this.props;

    const buttonStyle = {
      background: 'none',
      boxShadow: 'none',
      border: 'none',
      color: theme.secondary,
      cursor: 'pointer'
    };

    const padding = Math.max(significand ? 16 - 2 * significand.toString().length : 16, 10);

    const elementName = getClassName('scientificinput', theme);
    const filteredProps = getFilteredProps(this.props);

    const inputStyle = {
      borderRadius: 3,
      border: theme.dark ? 'none' : `1px solid ${colors.GREY}`,
      outline: 'none',
      paddingRight: padding,
      paddingLeft: padding,
      paddingTop: 8,
      paddingBottom: 8,
      color: theme.dark ? '#fff' : colors.OFF_WHITE,
      backgroundColor: theme.dark ? '#22272a' : '#fff',
      fontSize: 14,
      boxSizing: 'border-box'
    };

    return (
      <div id={id} className={elementName + (className ? ' ' + className : '')} style={style}>
        <LabelContainer className={elementName + '__label'} {...filteredProps}>
          <div>
            <input
              name={'significand'}
              disabled={disabled}
              style={{
                input: inputStyle,
                width: `${size}px` || '56px',
                btn: buttonStyle,
                'btn:hover': buttonStyle,
                'btn:active': buttonStyle,
                'input:disabled': {
                  opacity: 0.65,
                  cursor: 'not-allowed'
                }
              }}
              type={'number'}
              value={this.state.significand}
              onChange={this.setValue}
            />
            <select
              name={'magnitude'}
              disabled={disabled}
              style={{
                height: '20px',
                btn: buttonStyle,
                'btn:hover': buttonStyle,
                'btn:active': buttonStyle,
                'input:disabled': {
                  opacity: 0.65,
                  cursor: 'not-allowed'
                }
              }}
              value={this.state.magnitude}
              onChange={this.setValue}
            >
              <option value={24}>Y{baseUnit}</option>
              <option value={21}>Z{baseUnit}</option>
              <option value={18}>E{baseUnit}</option>
              <option value={15}>P{baseUnit}</option>
              <option value={12}>T{baseUnit}</option>
              <option value={9}>G{baseUnit}</option>
              <option value={6}>M{baseUnit}</option>
              <option value={3}>k{baseUnit}</option>
              <option value={0}>{baseUnit}</option>
              <option value={-3}>m{baseUnit}</option>
              <option value={-6}>&mu;{baseUnit}</option>
              <option value={-9}>n{baseUnit}</option>
              <option value={-12}>p{baseUnit}</option>
              <option value={-15}>f{baseUnit}</option>
              <option value={-18}>a{baseUnit}</option>
              <option value={-21}>z{baseUnit}</option>
              <option value={-24}>y{baseUnit}</option>
            </select>
          </div>
        </LabelContainer>
      </div>
    );
  }
}

ScientificInput.defaultProps = {
  theme: light,
  labelPosition: 'top',
  persisted_props: ['significand', 'magnitude', 'value'],
  persistence_type: 'local'
};

ScientificInput.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: PropTypes.string,

  /**
   * The value stored in the component. significand * 10^magnitude
   */
  value: PropTypes.number,

  /**
   * The size (length) of the numeric input in pixels
   */
  size: PropTypes.number,

  /**
   * If true, numeric input cannot changed.
   */
  disabled: PropTypes.bool,

  /**
   * Theme configuration to be set by a ThemeProvider
   */
  theme: PropTypes.object,

  /**
   * Description to be displayed alongside the control. To control styling,
   * pass an object with label and style properties.
   */
  label: PropTypes.oneOfType([
    /**
     * Label to be displayed
     */
    PropTypes.string,

    /**
     * The style and label
     */
    PropTypes.shape({
      style: PropTypes.object,
      label: PropTypes.string
    })
  ]),

  /**
   * The significand
   */
  significand: PropTypes.number,

  /**
   * The order of magnitude
   */
  magnitude: PropTypes.oneOf([...Array(17)].map((x, y) => -24 + 3 * y)),

  /**
   * The Base unit of measure (e.g. Hz, T, g, K, Wb, etc.)
   */
  baseUnit: PropTypes.string,

  /**
   * Where the numeric input label is positioned.
   */
  labelPosition: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Class to apply to the root component element.
   */
  className: PropTypes.string,

  /**
   * Style to apply to the root component element.
   */
  style: PropTypes.object,

  /**
   * Dash-assigned callback that gets fired when selected
   * value changes.
   */
  setProps: PropTypes.func,

  /**
   * Used to allow user interactions in this component to be persisted when
   * the component - or the page - is refreshed. If `persisted` is truthy and
   * hasn't changed from its previous value, a `value` that the user has
   * changed while using the app will keep that change, as long as
   * the new `value` also matches what was given originally.
   * Used in conjunction with `persistence_type`.
   */
  persistence: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]),

  /**
   * Properties whose user interactions will persist after refreshing the
   * component or the page. Since only `value` is allowed this prop can
   * normally be ignored.
   */
  persisted_props: PropTypes.arrayOf(PropTypes.oneOf(['value', 'significand', 'magnitude'])),

  /**
   * Where persisted user changes will be stored:
   * memory: only kept in memory, reset on page refresh.
   * local: window.localStorage, data is kept after the browser quit.
   * session: window.sessionStorage, data is cleared once the browser quit.
   */
  persistence_type: PropTypes.oneOf(['local', 'session', 'memory'])
};

const ThemedScientificInput = withTheme(ScientificInput);
ThemedScientificInput.defaultProps = ScientificInput.defaultProps;
export default ThemedScientificInput;
