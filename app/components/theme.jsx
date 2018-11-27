'use strict';

class Theme {
    static colors: {
        primary: '#337ab7',
        danger: '#CD3232',
		error: '@color-danger',
		warning: '#F0AD4E',
		info: '#5BC0DE',
		success: '#3f038e',
		muted: '#999',
    },
    static styles: {
        primary: {color: Theme.colors.primary},
        danger: {color: Theme.colors.danger},
        error: {color: Theme.colors.error},
        warning: {color: Theme.colors.warning},
        info: {color: Theme.colors.info},
        success: {color: Theme.colors.success},
        muted: {color: Theme.colors.muted}
    }
}



export default Theme;
