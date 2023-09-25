/** @type { import('@storybook/react').Preview } */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';  // Adjust based on your React version
configure({ adapter: new Adapter() });

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
