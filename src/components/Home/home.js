import React, {useState} from 'react';
import NavBar from '../navbar/navbar';
const Home = () => {
    const [dropDownVal, setDropDownVal] = useState('-1');
    const [selectedOptionObj, setSelectedObj] = useState(null);
    const DropDownInformation = [
        {
            id: '-1',
            optionName: 'please select option',
            isDisabled: true,
            selected: true
        },
        {
            id: '1',
            optionName: 'React JS',
            informationText: "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes."
        },
        {
            id: '2',
            optionName: 'Vue JS',
            informationText: "Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications. It was created by Evan You, and is maintained by him and the rest of the active core team members."
        },
        {
            id: '3',
            optionName: 'Angular JS',
            informationText: "AngularJS is a JavaScript-based open-source front-end web framework for developing single-page applications. It is maintained mainly by Google and a community of individuals and corporations."
        },
        {
            id: '4',
            optionName: 'Ember JS',
            informationText: "Ember.js is an open-source JavaScript web framework, utilizing a component-service pattern. It allows developers to create scalable single-page web applications by incorporating common idioms, best practices"
        },
    ]
    const onChangeDropDown = (e) => {
        setDropDownVal(e);
        let a = DropDownInformation.filter(d => d.id === e);
        setSelectedObj(DropDownInformation.filter(d => d.id === e)[0])
    }
    return(
        <>
            <NavBar
                isHomePage={true}
                DropDownInformation={DropDownInformation}
                dropDownVal={dropDownVal}
                onChangeDropDown={onChangeDropDown}
                selectedOptionObj={selectedOptionObj}
            />
        </>
    )
}
export default Home;