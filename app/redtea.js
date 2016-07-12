function read (label, stories) {

  let code = `return describe('${label}',`;

  code += parse(stories, '  ');

  code += `
);`

  console.log("redtea.read", code);

}


function parse (stories, tab = '') {
  let code = ` it => {`;

  stories.forEach(story => {

    const label = Object.keys(story)[0];

    code += `

${tab}it('${label}', `;

    if ( typeof story[label] === 'function' ) {
      code += `${story[label]}`;
    }

    else if ( Array.isArray(story[label]) ) {
      code += parse(story[label], tab + '  ');
    }

    code += `

${tab});`;

  });

  code += `
${tab}}`;

  return code;
}

export default read;
