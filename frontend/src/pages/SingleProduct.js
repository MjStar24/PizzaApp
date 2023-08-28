import { useState,useEffect,useContext } from "react";
import{useParams,useHistory} from 'react-router-dom';
import { CartContext } from "../CartContext";
const SingleProduct=(props)=>{
    const[product,setProduct]=useState({});
    const[isAdding,setIsAdding]=useState(false);
    const {cart,setCart}=useContext(CartContext);
    const params=useParams();
    const history=useHistory();
    useEffect(()=>{
        fetch(`/api/products/${params._id}`)
        .then(response=>response.json())
        .then(product=>{
            setProduct(product);
        });
    },[params._id]);

    const addToCart=(event,productId)=>{
        setIsAdding(true);
        let _cart={...cart};
        if(!_cart.items){
            _cart.items={};
        }
        if(!_cart.items[productId]){
            _cart.items[productId]=1;
        }else{
            _cart.items[productId]+=1;
        }
        if(!_cart.totalItems){
            _cart.totalItems=0;
        }
        _cart.totalItems+=1;
        setCart(_cart);
        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };
    
    return (
        <>
        <div className="container mx-auto mt-4">
            <button className="mb-5 font-bold bg-yellow-500 rounded-full p-2" onClick={()=>{history.goBack()}}>BACK</button>
            <div className="flex">
                <img className="h-25 w-40" src={product.image} alt=""/>

                <div className="ml-12">
                    <h1 className="font-bold text-xl my-1">{product.name}</h1>
                    <div className="text-slate-500 my-1">{product.size}</div>
                    <div className="font-bold">{product.price}</div>
                    <button disabled={isAdding} onClick={(e)=>{addToCart(e,product._id)}}className={`${isAdding ? 'bg-green-500' : 'bg-yellow-500' } font-bold bg-yellow-500 rounded-full p-2 my-5`}>Add{isAdding?"ed":""} to Cart</button>
                </div>

            </div>
        </div>
        </>
    )
}

export default SingleProduct;