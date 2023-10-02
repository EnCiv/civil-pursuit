/*
This file is converted from storybook4 to storybook7.
Storybook7 typically interacts with the component as a user would,
so I Left some cases which directly interact with component's method unconverted in comment.
 */
import React from 'react';
import Item from '../app/components/item';
import Common from './common';
import expect from "expect";
import {userEvent, within} from "@storybook/testing-library";
import { logger } from 'log4js/lib/logger';





const testType = {
  _id: '56ce331e7957d17202e996d6',
  name: 'Intro',
  harmony: [],
  id: '9okDr',
}

export default {
  component: Item,
  decorators: [
    Story => {
      Common.outerSetup()
      return <Story />
    },
  ],
}

export const BasicTestItem = {
  args: {
    item:{
      subject: 'Test Item Subject',
      description:
          'Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n',
      type: testType,
    },
    className: 'whole-border',
    style: Common.outerStyle,
  },
}

export const WithoutImageOrReference = {
  args: {
    ...BasicTestItem.args,
  },
}

export const WithImageNoReference = {
  args: {
    item: {
      ...BasicTestItem.args.item,
      image: 'https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg',
    },
    className: 'whole-border',
    style: Common.outerStyle,
  },
}

export const WithImageAndReferenceNoClick = {
  args:{
    item: {
      ...WithImageNoReference.args.item,
      references: [{url: 'https://www.civilpursuit.com', title: 'Civil Pursuit'}],
    },
    className: 'whole-border',
    style: Common.outerStyle,
  }
}

export const WithImageAndReferenceAndClick = {
  args: {
    ...WithImageAndReferenceNoClick.args,
  },
  play: async ({ canvasElement }) => {
    await Common.asyncSleep(1000);
    const canvas = within(canvasElement);
    const computedStyle = window.getComputedStyle(canvasElement);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    const originalHeight = parseFloat(computedStyle.getPropertyValue('height'));
    expect(originalHeight).toBeLessThan(9 * fontSize);

    const subjectElement = canvas.getByRole("heading",{name: /Test Item Subject/});
    await userEvent.click(subjectElement);
    await Common.asyncSleep(600);
    const afterHeight = parseFloat(computedStyle.getPropertyValue('height'));
    expect(afterHeight).toBeGreaterThan(originalHeight);

  }
}

export const WithEditButton = {
  args:{
    ...WithImageNoReference.args,
    visualMethod:"edit"
  },
}

export const Titleized = {
  args: {
    ...WithImageNoReference.args,
  },
  render: (args) =>{
    return <div style={Common.outerStyle}><Item {...args} visualMethod="titleize"  rasp={{shape: 'title'}}/></div>;
  },
  play: async({canvasElement}) =>{
    await Common.asyncSleep(1000);
    const computedStyle = window.getComputedStyle(canvasElement);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    const height = parseFloat(computedStyle.getPropertyValue('height'));
    expect(height).toBeLessThan(2*fontSize);

  }
}


export const WithVisualMethodOoview = {
  args: {
    ...WithImageNoReference.args,
  },
  render: (args) =>{
    return <div><Item {...args} visualMethod="ooview"  rasp={{shape: 'open'}}/></div>;
  },
  play: async({canvasElement}) =>{
    await Common.asyncSleep(1000);
    const computedStyle = window.getComputedStyle(canvasElement);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    const height = parseFloat(computedStyle.getPropertyValue('height'));
    expect(height).toBeGreaterThan(4*fontSize);
  }
}

export const OoviewAfterImeediateDescendantTakesFocus  = {
  args: {
    ...WithImageNoReference.args,
  },
  render: (args) =>{
    return <div><Item {...args} visualMethod="ooview"  rasp={{shape: 'open'}}/></div>;
  },
  play: async({canvasElement}) =>{
    await Common.asyncSleep(1000);
    const computedStyle = window.getComputedStyle(canvasElement);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    const height = parseFloat(computedStyle.getPropertyValue('height'));
    expect(height).toBeGreaterThan(4*fontSize);

  }
}

// .add('Item with VisualMethod ooview after immediate descendant takes focus', () => {
//     Common.outerSetup();
//
//     const testItem = {
//         subject: "Test Item Subject",
//         description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
//         image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
//         type: testType
//     }
//
//     const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;
//
//     setTimeout(()=>{ // do this after the story has rendered
//         Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
//         Common.Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 0}); // kick off state change for next state
//         setTimeout(()=>{ // now wait for that to render
//             specs(() => describe('Item ooview', ()=>{
//                 it('Item should open in truncated state', function () {
//                     let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
//                     return expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
//                 });
//             }));
//         },600)
//     })
//     return Common.outerDiv
// })
//
// .add('ooview after distant descendant focus', () => {
//     Common.outerSetup();
//
//     const testItem = {
//         subject: "Test Item Subject",
//         description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
//         image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
//         type: testType
//     }
//
//     const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;
//
//     setTimeout(()=>{ // do this after the story has rendered
//         Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
//         setTimeout(()=>{ // let the item finish it's transition
//             Common.Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 3}); // kick off state change for next state
//             setTimeout(()=>{ // now wait for that to render
//                 specs(() => describe('Item ooview', ()=>{
//                     it('Only the title should be shown', function () {
//                         let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
//                         expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeLessThan(2*fontSize);
//                     });
//                 }));
//             },600)
//         },1000)
//     })
//     return Common.outerDiv;
// })

export const ItemVMEditShapeEdit = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },

  play:async({canvasElement, step}) =>{
    const canvas = within(canvasElement);
    await step('Test the initial state of the Creator', async () =>{
      await step('It should not have any error messages', async () =>{
        const errorMessage = canvas.queryByText(/Item-error-message[-|/d]+/);
        expect(errorMessage).toBeNull();
      });
      await step('It should have a Post button', async () =>{
        const postButton = canvas.queryByRole('button', { name: /post/i });
        expect(postButton).not.toBeNull();
      });
    })
  }
}

export const CreateAnItemSubject = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    await Common.asyncSleep(600);
    const canvas = within(canvasElement);
    const subject = canvas.getByPlaceholderText(/subject/i);
    await userEvent.clear(subject);
    await userEvent.type(subject, 'Test Input Subject');
    expect(subject.value).toBe('Test Input Subject');
  }
}

export const CreateAnItemDescription = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    await Common.asyncSleep(600);
    const canvas = within(canvasElement);
    const descriptionBox = canvas.getByPlaceholderText(/description/i);
    await userEvent.clear(descriptionBox);
    await userEvent.type(descriptionBox, 'Test Input Description');
    expect(descriptionBox.value).toBe('Test Input Description');
  }
}

export const CreateAnItem = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    await Common.asyncSleep(600);
    const canvas = within(canvasElement);
    const subject = canvas.getByPlaceholderText(/subject/i);
    await userEvent.clear(subject);
    await userEvent.type(subject, 'Test Input Subject');
    expect(subject.value).toBe('Test Input Subject');
    const descriptionBox = canvas.getByPlaceholderText(/description/i);
    await userEvent.clear(descriptionBox);
    await userEvent.type(descriptionBox, 'Test Input Description');
    expect(descriptionBox.value).toBe('Test Input Description');
    await Common.asyncSleep(600);
    await userEvent.click(canvas.getByRole('button', {name: /post/i}));
    console.log();

    expect(canvas.getByRole('heading').textContent).toBe('Test Input Subject');
    expect(canvas.queryByText('Test Input Description')).not.toBeNull();

  }
}
export const CreateAnItemWithoutDescription = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Post/i }));
    await Common.asyncSleep(600);
    const canvas2 = within(canvasElement)
    await step('It should say description is required, in red', async () =>{
      let errorMessage = canvas2.queryByText(/Description is required/);
      await step('It should not have any error messages', async () =>{
        expect(errorMessage.innerText).toBe("Description is required");
      });
      await step('The color should be red', async () =>{
        expect(window.getComputedStyle(errorMessage).color).toBe("rgb(255, 0, 0)")
      });
    })
  }
}

export const CreateAnItemWithoutSubject = {
  args:{
    item:{
      type: testType
    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Post/i }));
    await Common.asyncSleep(600);
    const canvas2 = within(canvasElement)
    await step('It should say subject is required, in red', async () =>{
      let errorMessage = canvas2.queryByText(/Subject is required/);
      await step('It should not have any error messages', async () =>{
        expect(errorMessage.innerText).toBe("Subject is required");
      });
      await step('The color should be red', async () =>{
        expect(window.getComputedStyle(errorMessage).color).toBe("rgb(255, 0, 0)")
      });
    })
  }
}

export const createItemReference = {
  args:{
    item:{
      subject: "A Test Subject",
      description: "A Test Item",
      type: testType,

    }
  },
  render: (args) =>{
    return <Item {...args} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
  },
  play: async ({canvasElement, step}) =>{
    const testURL="https://www.civilpursuit.com";
    await Common.asyncSleep(600);
    const canvas = within(canvasElement);

    const ref = canvas.getByPlaceholderText(/https:/i);
    await userEvent.clear(ref);
    await userEvent.type(ref, testURL);
    expect(ref.value).toBe(testURL);

  }
}



// .add("Creating an Item Reference without the https://", () => {
//     Common.outerSetup();
//
//     const testItem = {
//         subject: "A Test Subject",
//         description: "A Test Item",
//         type: testType
//     }
//
//     const inputURL="www.civilpursuit.com"
//     const testURL="https://www.civilpursuit.com"
//     const testTitle="URL Title Test Succeeded!"
//     const testMessage="get url title"
//
//     const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
//     var emittedArgs;
//
//     window.socket.emit=(...args)=>{
//         emittedArgs=args;
//         if(args[0]===testMessage && args[1]===testURL  && (typeof args[2] === 'function')) {
//             args[2](testTitle)
//         }
//     }
//
//     setTimeout(()=>{ // do this after the story has rendered
//         Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
//         let textInput=Common.Wrapper.find('Input[name="reference"]')
//         textInput.instance().select();
//         textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: inputURL}}))
//         var inputNode=Common.Wrapper.find('Input[name="reference"]').getDOMNode()
//         inputNode.blur();
//         setTimeout(()=>{ // give user a chance to see the original state before we change it
//             specs(()=>describe(`It should say ${testTitle}`, ()=>{
//                 it('The socket should have received a message',()=>{
//                     expect(!!emittedArgs).toBe(true)
//                 })
//                 it(`the message api should have been: ${testMessage}`,()=>{
//                     expect(emittedArgs[0]).toBe(testMessage)
//                 })
//                 it(`the message parameter should have been: ${testURL}`,()=>{
//                     expect(emittedArgs[1]).toBe(testURL)
//                 })
//                 it(`there should have been a callback function`,()=>{
//                     expect(typeof emittedArgs[2]).toBe('function')
//                 })
//                 it(`The input should say ${testTitle}`, ()=>{
//                     expect(Common.Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
//                 })
//                 it(`The Item should have a references array`,()=>{
//                     expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
//                 })
//                 it(`should show an edit-url icon (Pencil)`,()=>{
//                     expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
//                 })
//             }))
//         },1000)
//     })
//     return Common.outerDiv;
// })
//
// .add("Creating an Item Reference that fails", () => {
//     Common.outerSetup();
//
//     const testItem = {
//         subject: "A Test Subject",
//         description: "A Test Item",
//         type: testType
//     }
//
//     const testURL="civilpursuit"
//     const testTitle=undefined;
//     const testMessage="get url title"
//
//     const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
//     var emittedArgs;
//
//     window.socket.emit=(...args)=>{
//         emittedArgs=args;
//         if(args[0]===testMessage && (args[1]===testURL)  && (typeof args[2] === 'function')) {
//             args[2](testTitle)
//         }
//     }
//
//     setTimeout(()=>{ // do this after the story has rendered
//         Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
//         let textInput=Common.Wrapper.find('Input[name="reference"]')
//         textInput.instance().select();
//         textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: testURL}}))
//         var inputNode=Common.Wrapper.find('Input[name="reference"]').getDOMNode()
//         inputNode.blur();
//         setTimeout(()=>{ // give user a chance to see the original state before we change it
//             specs(()=>describe(`It should say ${testTitle}`, ()=>{
//                 it('The socket should have received a message',()=>{
//                     expect(!!emittedArgs).toBe(true)
//                 })
//                 it(`the message api should have been: ${testMessage}`,()=>{
//                     expect(emittedArgs[0]).toBe(testMessage)
//                 })
//                 it(`the message parameter should have been: ${testURL}`,()=>{
//                     expect(emittedArgs[1]).toBe(testURL)
//                 })
//                 it(`there should have been a callback function`,()=>{
//                     expect(typeof emittedArgs[2]).toBe('function')
//                 })
//                 it(`The input should say ${testTitle}`, ()=>{
//                     expect(Common.Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
//                 })
//                 it(`The Item should have a references array`,()=>{
//                     expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
//                 })
//                 it(`should show an edit-url icon (Pencil)`,()=>{
//                     expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
//                 })
//             }))
//         },1000)
//     })
//     return Common.outerDiv;
// })
//
// .add("Edit an Item Reference", () => {
//     Common.outerSetup();
//
//     const testURL="https://www.civilpursuit.com"
//     const testTitle="URL Title Test Succeeded!"
//     const testMessage="get url title"
//
//     const testItem = {
//         subject: "A Test Subject",
//         description: "A Test Item",
//         type: testType,
//         references: [{url: testURL, title: testTitle}]
//     }
//
//     var emittedArgs;
//
//     window.socket.emit=(...args)=>{
//         emittedArgs=args;
//         if(args[0]===testMessage && args[1]===testURL  && (typeof args[2] === 'function')) {
//             args[2](testTitle)
//         }
//     }
//
//     const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
//
//     const storyTest= async (e)=>{ // do this after the story has rendered
//         Common.Wrapper=mount(story,{attachTo: e});
//         await Common.asyncSleep(1000);
//         let editButton=Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+/);
//         editButton.click();
//         specs(()=>describe(`It should say`, ()=>{
//             it('The text input field should be present',()=>{
//                 expect(!!Common.Wrapper.find('Input[name="reference"]')).toBe(true)
//             })
//             it('The url input field should not be hidden', ()=>{
//                 expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+\s.ItemReference-hide[-|\d]+/)).toBe(false);
//             })
//         }))
//
//     }
//     return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
// })
//



