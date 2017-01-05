QSortButtonList = {
        unsorted: {
            name: 'unsorted',
            color: '#ffffff',
            title: {
                active: "Yea! this is in a stack",
                inactive: "Put this in in a stack"
            },
            direction: 'Great! You have completed this step. You can review your choices continue to the next step.'
        },
        most: {
            name: 'most',
            color: '#e0e0ff',
            title: {
                active: "Yea! this is in the most important stack",
                inactive: "Put this in the most important stack"
            },
            max: 5,
            direction: 'We are limiting the number of things in the "most" stack to 5. Please  move some to other stacks'
        },
        neutral: {
            name: 'neutral',
            color: '#e0e0f0',
            title: {
                active: "This is among the things that are neight most nor least important",
                inactive: "Put this among the things that are neight most nor least important"
            }
        },
        least: {
            name: 'least',
            color: '#ffe0e0',
            title: {
                active: "This is in the least important stack of them all",
                inactive: "Put this in the least important stack of them all"
            },
            max: 6,
            direction: 'We are limiting the number of things in the "least" stack to 6. Please  move some to other stacks'
        }
    };
export default QSortButtonList;