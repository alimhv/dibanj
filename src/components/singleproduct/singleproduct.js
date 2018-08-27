import React, { Component } from 'react';
import HeaderLayout from "../../components/header/header";
import {Button, Container} from "native-base";
import {Image, ImageBackground, Text, View} from "react-native";
import styles from './singleproduct.css'
import {Actions} from "react-native-router-flux";
import FIcon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";
import {
    addBasket, addBookmark, addCloud, removeBasket, removeBookmark, removeCloud,
    saveProducts
} from "../../redux/actions";
import HTML from "react-native-render-html";

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
    render(){
        const {prod}=this.props
        // console.log(prod)

        let maxlimit=100;
        let regex = /(<([^>]+)>)/ig
        if(prod.Description){
            prod.Description=prod.Description.replace(regex,'').replace(/(\&.*\;)/gi, '').replace(/^\s*$(?:\r\n?|\n)/gm,'')
        }
        // prod.Description=(prod.Description&&((prod.Description).length > maxlimit) ?
        //     (((prod.Description).substring(0,maxlimit-3)) + '...') :
        //     prod.Description );
        // console.log(prod)
        return(
            <View style={styles.main}>
                {prod.canBuySeperatly!=0&&
                    <Button style={styles.buy} title={prod.id} onPress={() => {
                        if (this._findBasket()) {
                            alert("قبلا به سبد اضافه شده است")
                        }
                        else if (prod.canBuySeperatly === 0) {
                            alert("این محصول جداگانه قابل خرید نیست ")
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
                    <View style={styles.details}>
                        <Text  style={[styles.detalsText]}>{prod.Title}</Text>
                        <Text  style={[styles.detalsText]}>{prod.persianRegisterDeadLine?prod.persianRegisterDeadLine.split(' ')[0]:''}</Text>
                        <Text  style={[styles.detalsText]}>{prod.Duration}</Text>
                        <Text  style={[styles.detalsText]}>{prod.fullName}</Text>
                        <Text  style={[styles.detalsText]}>{prod.Description}</Text>
                        {/*<Text>{prod.Description}</Text>*/}
                    </View>
                    {this._getPrices(prod)}
                </View>
                <Button style={styles.sample} title={prod.id} onPress={()=>{
                    Actions.lesson({ProductAndCourseId:prod.ProductAndCourseId,isSample:1});
                }}>
                    <Text style={styles.proBtnText}>نمونه</Text>
                </Button>
            </View>
        );
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
        basket:state.basket
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(SingleProduct);