const QSortButtonList = {
        unsorted: {
            name: 'unsorted',
            color: '#ffffff',
            title: {
                active: "Yea! this is in a stack",
                inactive: "Put this in in a stack"
            },
            direction: 'Great! You have completed this step. You can review your choices or continue to the next step.'
        },
        most: {
            name: 'most',
            color: '#e0e0ff',
            title: {
                active: "Yea! this is in the most important stack",
                inactive: "Put this in the most important stack"
            },
            max: 5,
            direction: 'We are limiting the number of things in the "most" stack to 5. Please  move some to other stacks',
            harmonySide: 'left'
        },
        neutral: {
            name: 'moderate',
            color: '#e0e0e0',
            title: {
                active: "This is among the things that are neighter most nor least important",
                inactive: "Put this among the things that are neighter most nor least important"
            }
        },
        least: {
            name: 'least',
            color: '#ffe0e0',
            title: {
                active: "This is in the least important stack of them all",
                inactive: "Put this in the least important stack of them all"
            },
            harmonySide: 'right'
        }
    };
export default QSortButtonList;