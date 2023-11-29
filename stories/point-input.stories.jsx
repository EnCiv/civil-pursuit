import PointInput from '../app/components/point-input';

export default {
    component: PointInput,
    args: {}
}

export const defaultValueUndefined = { args: {} }

export const defaultValueEmpty = {
    args: {
        defaultValue: {}
    }
}

export const descriptionFieldGrowthWordCountOK = {
    args: {
        defaultValue: {
            "description": "Risuspretiumquam vulputatedignissim suspendissein. Metusvulputateeuscelerisquefelis imperdietproinfermentumleo. Hachabitasseplatea dictumst quisque. Nibhsedpulvinarproin. Loremipsumdolorsit amet, consecteturadipiscingeliseddoeiusmodtempor incididunt ut labore etdolore magnaaliqua. Utenimadminimveniamquisnostrud exercitationullamcolaborisnisutaliquipcommodo consequat. Risuspretiumquamvulputatedignissim suspendissein est ante in. Metusvulputateeu imperdietproinfermentumleo. Hachabitasseplatea. Consecteturadipiscingeliseddoeiusmodtempor incididunt."},
    },
}

export const descriptionFieldErrorTooMuchText = {
    args: {
        defaultValue: {
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Purus sit amet volutpat consequat mauris. Faucibus pulvinar elementum integer enim neque volutpat. Leo in vitae turpis massa sed elementum tempus egestas sed. Volutpat consequat mauris nunc congue nisi vitae suscipit. Egestas tellus rutrum tellus pellentesque eu. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Ut aliquam purus sit amet luctus venenatis lectus magna fringilla. Tincidunt dui ut ornare lectus sit amet est placerat in. Bibendum arcu vitae elementum curabitur vitae nunc sed velit.",
            "subject": "Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet."
        }
    }
}

export const subjectFieldErrorTooMuchText = {
    args: {
        defaultValue: {
            "subject": "Pellentesque habitant morbi tristique senectus et. Eu scelerisque felis imperdiet proin fermentum leo vel orci porta. Orci eu lobortis elementum nibh tellus molestie nunc. Vel turpis nunc eget lorem dolor sed. Leo vel orci porta non pulvinar neque laoreet."
        }
    }
}
