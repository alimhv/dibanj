import React, { Component } from 'react';
import HeaderLayout from "../../components/header/header";
import {Button, Container} from "native-base";
import {FlatList, Image, Picker, Text, TextInput, View} from "react-native";
import styles from './workout.css'
import {Actions} from "react-native-router-flux";
import FIcon from 'react-native-vector-icons/FontAwesome';
import {SegmentedControls} from "react-native-radio-buttons";
import WorkoutReport from "../../components/workoutreport/workoutreport";
import {connect} from "react-redux";
import Http from "../../services/http";

class Workout extends Component{
    _getExamAndPractice=async()=> {
        let response = await Http._postAsyncData({
            userId: this.props.user.userId,
            type: this.props.examType,
            token: this.props.user.token
        }, 'userCourseAndPractice');
        if (Array.isArray(response)) {
            this.practices = response;
        }
        // console.log("userCourses",response,{userId:this.props.user.userId,token:this.props.user.token})
        this.setState({changeUI: this.state.changeUI + 1})
    }
    practices=[];
    state={
        changeUI:0,
    }
    componentWillMount(){
        this._getExamAndPractice();
    }
    _renderItem = (item, index) => {
        item['id'] = index;
        return (<WorkoutReport workout={item}/>);
    };
    render() {
        return (
            <View style={styles.main}>
                <Image style={styles.bgimage} source={require('../../assets/images/bg.jpg')}/>
                <HeaderLayout back={true}/>

                    <FlatList
                        data={this.practices}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) =>
                            this._renderItem(item, index)
                        }
                    />
            </View>
        );
    }

}
const mapStateToProps=state=>{
    return{
        user:state.user,
    }
};
export default connect(mapStateToProps,null)(Workout);