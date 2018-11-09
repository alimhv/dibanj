import React, { Component } from 'react';
import HeaderLayout from "../../components/header/header";
import {Button, Container} from "native-base";
import {Image, ImageBackground, ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from './singleproduct.css'
import {Actions} from "react-native-router-flux";
import FIcon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";
import {
    addBasket, addBookmark, addCloud, removeBasket, removeBookmark, removeCloud,
    saveProducts
} from "../../redux/actions";
//import HTML from "react-native-render-html";

class SingleProduct extends Component{
    _getNotExistImage(prod){
        return(
            <Image style={styles.image} source={require('./../../assets/images/bg.jpg')}/>
        );
    }
    _getPrices(prod){
        let decStyle={color:'black'};
        if(prod.DiscountPercent!=0||prod.PriceAfterDiscount!=0){
            decStyle={textDecorationLine: 'line-through', textDecorationStyle: 'solid',color:'red', textDecorationColor: 'red'};
            if(prod.DiscountPercent==0&&prod.PriceAfterDiscount!=0){
                prod.PriceAfterDiscount=parseInt((prod.DiscountPercent/prod.price)*100);
            }
            else if(prod.DiscountPercent!=0&&prod.PriceAfterDiscount==0){
                prod.DiscountPercent=prod.price*parseInt(prod.PriceAfterDiscount/100)
            }
        }
        if(prod.PriceAfterDiscount==prod.price||(prod.PriceAfterDiscount==0&&prod.DiscountPercent==0)){
            prod.PriceAfterDiscount=0;
            decStyle={color:'black'}
        }

        return(
            <View style={styles.prices}>
                { prod.price>0&&
                <Text style={[styles.detalsText,decStyle]}>
                    {prod.price}
                </Text>
                }
                {prod.DiscountPercent > 0 &&

                <Text style={styles.detalsText}>{prod.DiscountPercent}</Text>
                }
                {prod.PriceAfterDiscount > 0 &&
                <Text style={[styles.detalsText,{color:'green'}]}>{prod.PriceAfterDiscount}</Text>
                }
            </View>
        );
    }
    _findBasket=()=>{
        for(let i=0;i<this.props.basket.basket.length;i++){
            if(this.props.prod.productAndCourseId==this.props.basket.basket[i].productAndCourseId){
                return true;
            }
        }
        return false;
    }
    _findProduct=()=>{
        for(let i=0;i<this.props.products.length;i++){
            if(this.props.prod.ProductAndCourseId==this.props.products[i].ProductAndCourseId){
                return true;
            }
        }
        return false;
    }
    render(){
        const {prod,masters,category,search}=this.props
        if(prod.fullName&&prod.userId){
            masters.unshift({
                fullName:prod.fullName,
                userId:prod.userId,
                uniqueCode:prod.uniqueCode,
            })
        }
        const myProduct=this._findProduct();
        // console.log(prod)

        let maxlimit=100;
        let regex = /(<([^>]+)>)/ig
        // console.log(prod.Description)

        if(prod.Description) {
            prod.Description = prod.Description.replace(regex, '').replace(/(\&[a-zA-Z0-9]+\;)/gi, '').replace(/^\s*$(?:\r\n?|\n)/gm, '')
        }
            // console.log(prod.Description)
        // prod.Description=(prod.Description&&((prod.Description).length > maxlimit) ?
        //     (((prod.Description).substring(0,maxlimit-3)) + '...') :
        //     prod.Description );
        // console.log(prod)
        let descStyle={}
        if(!this.canBy(prod)){
            descStyle.flex=1
        }
        let duration=false;
        // prod.Duration="10 روز"
        // prod.Title+=' '+prod.Title+' '+prod.Title+' '+prod.Title;
        if(prod.Duration&&prod.Duration.trim()!==''){
            duration=true;
        }
        return(
            <View style={styles.main}>
                {this.canBy(prod)&&
                    <Button style={styles.buy} title={prod.id} onPress={() => {
                        if (this._findBasket()) {
                            alert("قبلا به سبد اضافه شده است")
                        }
                        else {
                            alert("به سبد خرید اضافه شد")
                            this.props.addBasket(prod);
                        }
                    }}>
                        {prod.price == 0 &&
                        <Text style={styles.proBtnText}>رایگان</Text>
                        }
                        {prod.price > 0 &&
                        <Text style={styles.proBtnText}>خرید</Text>
                        }
                        </Button>
                }
                <View style={styles.content}>
                    <View style={[styles.details,descStyle]}>
                        <Text  style={[styles.detalsText]}>{prod.Title}</Text>
                        <Text  style={[styles.detalsText]}>{prod.persianRegisterDeadLine?prod.persianRegisterDeadLine.split(' ')[0].replace(/-/gi,'/'):''}</Text>
                        {
                            duration&&
                            <Text style={styles.detalsText}>{'مدت دوره:'+prod.Duration}</Text>
                        }
                        <Text  style={[styles.detalsText]}>{prod.Description}</Text>
                        {/*<Text>{prod.Description}</Text>*/}
                        {masters.map((item,index)=>{
                           return (<TouchableOpacity key={index} style={styles.btns} onPress={()=>Actions.user({userId:item.userId,category,search})}>
                                <Text style={[styles.detalsText,{color:'blue'}]} >{item.fullName}</Text>
                            </TouchableOpacity>)
                        })}
                        {this._getPrices(prod)}
                    </View>
                </View>
                {(prod.price == 0 ||myProduct)&&
                <Button style={styles.sample} title={prod.id} onPress={()=>{
                    Actions.lesson({ProductAndCourseId:prod.ProductAndCourseId,isSample:0});
                }}>
                    <Text style={styles.proBtnText}>مشاهده</Text>
                </Button>
                }
                {prod.price > 0 &&!myProduct&&
                <Button style={styles.sample} title={prod.id} onPress={()=>{
                    Actions.lesson({ProductAndCourseId:prod.ProductAndCourseId,isSample:1});
                }}>
                <Text style={styles.proBtnText}>نمونه</Text>
                </Button>
                }
            </View>
        );
    }
    canBy=(prod)=>{
        let deadline=false;
        if(prod.RegisterDeadLine){
            // let now=new Date(new Date().toISOString()).getTime()
            // let deadline=new Date(prod.RegisterDeadLine).getTime()
            // console.log((new Date(prod.RegisterDeadLine)-new Date(new Date().toISOString())),deadline<now,deadline,now,new Date(prod.RegisterDeadLine),new Date(),prod.Title)
            if((new Date(prod.RegisterDeadLine)-new Date(new Date().toISOString()))<0){
                deadline=true;
            }
        }
        let count=false;
        if(prod.remainCount!==-1&&prod.remainCount<1){
            count=true;
        }
        const myProduct=this._findProduct();
        // console.log((prod.canBuySeperatly != 0||!prod.ParentId),prod.price>0,!deadline,!myProduct,!count)
        if(((prod.canBuySeperatly != 0||!prod.ParentId)&&prod.price>0)&&!deadline&&!myProduct&&!count){
            return true;
        }else{
            return false;
        }
    }
}
const mapDispatchToProps=(dispatch)=> {
    return{
        addBasket:(product)=>{
            dispatch(addBasket(product));
        },

    }
}
const mapStateToProps=state=>{
    return{
        user:state.user,
        products:state.products.products,
        basket:state.basket
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(SingleProduct);