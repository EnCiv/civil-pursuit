'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';
import EvaluationStore    from '../store/evaluation';
import Promote from '../promote';

exports.button=class PromoteButton extends React.Component {

  render() {
    const { active, panel, item, onClick, user } = this.props;
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
        if (active) {
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

exports.panel = class PromotePanel extends React.Component {
  mounted = false;
  render() {
    const { active, panel, item, onClick, user, style, emitter, rasp } = this.props;
    const nextRASP={shape: 'truncated', depth: rasp.depth, toParent: rasp.toParent} // RASP 1 to 1 case - subcomponents always start truncated, I'm not saving state so no change in depth, my parent is your parent
    if (!this.mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before. 
    else {
      this.mounted = true;
      // using key below to foce rerendering of evaluations for each new item to be evaluated.  Otherwise React just reuses the last set. 
      return (
        <div className="toggler promote"  key={item._id+'-toggler-'+this.constructor.name}>
          <Accordion 
            active={active}
            style={style}
          >
            <EvaluationStore
              item-id={item._id}
              active={active}
              emitter={emitter}
            >
              <Promote
                ref="promote"
                item={item}
                panel={panel}
                user={user}
                hideFeedback={this.props.hideFeedback}
                rasp={nextRASP}
              />
            </EvaluationStore>
          </Accordion>
        </div>
      )
    }
  }
}