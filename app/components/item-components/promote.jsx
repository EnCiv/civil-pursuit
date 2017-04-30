'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion from '../util/accordion';
import TypeComponent from '../type-component';

var Promote = { button: PromoteButton, panel= PromotePanel }
export default Harmony;

class HarmonyButton extends React.Component {

  render() {
    const { buttonState, panel, item, onClick } = this.props;
    let promoteButtonLabel = null;
    var success = false;
    var inactive = false;
    let title = null;

    if (item.type && item.type.promoteMethod !== "hidden") {
      if (panel && panel.type && panel.type.promoteButtonLabel) {
        promoteButtonLabel = item.upvote.userDidUpvote ? panel.type.promoteButtonLabel.active : panel.type.promoteButtonLabel.inactive;
      } else {
        promoteButtonLabel = item.upvote.userDidUpvote ? "Upvoted" : "Upvote";
      }
      if (user) {
        if (buttonState.promote) {
          success = true;
          title = "End upvote without a choice";
        } else {
          if (item.upvote.userDidUpvote) {
            inactive = true;
            title = "Yea! you've upvoted this one";
          } else {
            title = "Upvote this";
          }
        }
      } else {
        inactive = true;
        title = "Join so you can upvote this discussion";
      }

      return (
        <ButtonGroup>
          <span className="civil-button-info">{item.promotions}</span>
          <Button
            small
            shy
            success={success}
            inactive={inactive}
            onClick={onClick}
            title={title}
            className="promote-button"
          >
            <span className="civil-button-text">{promoteButtonLabel}</span>
          </Button>
        </ButtonGroup>
      );
    } else return null;
  }
}

class PromotePanel extends React.Component {
  mounted = false;
  render() {
    if (!mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;
      return (
        <div className="toggler promote">
          <Accordion
            active={active}
            style={{ backgroundColor: bgc }}
          >
            <EvaluationStore
              item-id={item._id}
              toggle={onClick}
              active={active}
              emitter={emitter}
            >
              <Promote
                ref="promote"
                show={active}
                panel={panel}
                user={user}
                hideFeedback={this.props.hideFeedback}
              />
            </EvaluationStore>
          </Accordion>
        </div>
      )
    }
  }
}