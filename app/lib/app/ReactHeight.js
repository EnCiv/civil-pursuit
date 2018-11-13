/* eslint "react/no-did-mount-set-state":0 */
/* eslint "react/no-did-update-set-state":0 */
/* forked from https://github.com/nkbt/react-height */


import React from 'react';
import PropTypes from 'prop-types';
import {shouldComponentUpdate} from 'react/lib/ReactComponentWithPureRenderMixin';


const ReactHeight = React.createClass({
  propTypes: {
    children: PropTypes.node.isRequired,
    onHeightReady: PropTypes.func.isRequired,
    hidden: PropTypes.bool,
    dirty: PropTypes.bool
  },


  getDefaultProps() {
    return {hidden: false, dirty: true};
  },


  getInitialState() {
    return {
      height: 0, dirty: this.props.dirty
    };
  },


  componentDidMount() {
    if(this.refs.wrapperRef) {
      const height = this.refs.wrapperRef.clientHeight;
      const dirty = false;

      this.setState({height, dirty}, () => this.props.onHeightReady(this.state.height));
    }
  },


  componentWillReceiveProps({children, dirty}) {
    if (children !== this.props.children || dirty) {
      this.setState({dirty: true});
    }
  },


  shouldComponentUpdate,


  componentDidUpdate() {
    if (this.refs.wrapperRef) {
      const height = this.refs.wrapperRef.clientHeight;
      const dirty = false;

      if (height === this.state.height) {
        this.setState({dirty});
      } else {
        this.setState({height, dirty}, () => this.props.onHeightReady(this.state.height));
      }
    }
  },


  setWrapperRef(el) {
    this.wrapper = el;
  },


  render() {
    const {
      onHeightReady: _onHeightReady,
      dirty: _dirty,
      hidden,
      children,
      ...props
    } = this.props;
    const {dirty} = this.state;

    if (hidden && !dirty) {
      return null;
    }

    if (hidden) {
      return (
        <div style={{height: 0, overflow: 'hidden'}}>
          <div ref='wrapperRef' {...props}>{children}</div>
        </div>
      );
    }

    return <div ref='wrapperRef' {...props}>{children}</div>;
  }
});


export default ReactHeight;
