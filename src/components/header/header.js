import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    Text,
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {Container, Header, Left, View, Right, Body, Title} from "native-base";
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export default class HeaderLayout extends Component {
    _getBackArrow() {
        if(this.isback)
        return(
        <MIcon name="chevron-left" onPress={() => Actions.pop()} color="white" size={35}/>);
        return;
    };
    isback=false;
    render() {
        const {back = false} = this.props;
        this.isback=back;
        return (
            <View style={styles.main}>
                <Header noShadow style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                    <Left >
                        {this._getBackArrow()}
                    </Left>
                    <Body style={styles.header}>
                    {/*<Text style={styles.headerTitle}>*/}
                        <Image source={require("../../assets/images/dibanzh.png")} style={styles.logo}/>
                    {/*</Text>*/}
                    </Body>
                    <Right style={{backgroundColor: 'rgba(0,0,0,0)',flex:0,margin:0,padding:0}}>
                        <MIcon name="menu" onPress={() => Actions.drawerOpen()} color="white" size={30}/>
                    </Right>

                </Header>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgimage: {
        height:'100%',
        width:'100%',
        position:'absolute',
        top:0,
        left:0
    },
    header:{
        justifyContent:'center',
        alignItems:'flex-start',
         // marginRight:15,
        overflow:'visible',
        // backgroundColor:'red',
        width:'100%'
},
    logo:{
    width:100,
    height:30,
        marginLeft:10,
        overflow:'visible',

        // backgroundColor:'blue'
    },
  headerTitle:{
        textAlign:'center'
  }  ,
    main:{
        // backgroundColor:'green'
        // flex: 1,
        // flexDirection:'row',
        backgroundColor:'rgba(0,0,0,0)'
    }
});
