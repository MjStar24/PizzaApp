import { useContext,useEffect,useState } from 'react';
import { CartContext } from '../CartContext';

const Cart = () => {
const[Product,setProduct]=useState([]);
const{cart,setCart}=useContext(CartContext);
const[priceFetched,togglepriceFetched]=useState(false);

useEffect(() => {
  if(!cart.items){
    return;
  }
  if(priceFetched){
    return;
  }
  fetch('/api/products/cart-items',{
    method:"POST",
    headers:{
      "Content-Type":'application/json'
    },
    body: JSON.stringify({ids:Object.keys(cart.items)})
  }).then(res=>res.json())
  .then(products=>{
    setProduct(products);
    togglepriceFetched(true);
  })
}, [cart,priceFetched]);

const getQty=(productId)=>{
  return cart.items[productId];
}

const increment=(productId)=>{
  const existingQty=cart.items[productId];
  let _cart={...cart};
  _cart.items[productId]=existingQty+1;
  _cart.totalItems+=1;
  setCart(_cart);
}

const decrement=(productId)=>{
  const existingQty=cart.items[productId];
  if(existingQty===1){
    return;
  }
  let _cart={...cart};
  _cart.items[productId]=existingQty-1;
  _cart.totalItems-=1;
  setCart(_cart);
}
let total=0;
const getSum=(productId,price)=>{
  const sum=price*getQty(productId);
  total+=sum;
  return sum;
}

const handleDelete=(productId)=>{
  let qty=cart.items[productId];
  let _cart={...cart};
  _cart.totalItems-=qty;
  delete _cart.items[productId];
  
  setCart(_cart);
  const updatedList=Product.filter((products)=>products._id!==productId);
  // const updatedList=Product.filter((products)=>{productId!==products._id});
  setProduct(updatedList);

}

const handleOrderNow=()=>{
  window.alert("Order Placed Successfully");
  setProduct([]);
  setCart({});
}

  return (
    !Product.length ? <img className="mt-12 w-1/2 mx-auto"src="/images/empty-cart.png" alt="empty cart"/>
    :
    <div className="container mx-auto lg:w-1/2 w-full pb-24">
      <div className="my-12 font-bold">Cart Items</div>
      <ul>
        {Product.map(product=>{
          return(
            <li className="mb-12" key={product._id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img className="h-16" src={product.image}></img>
              <span className="font-bold ml-4 w-48">{product.name}</span>
            </div>
            <div>
              <button onClick={()=>{decrement(product._id)}}className="bg-yellow-500 px-4 py-2 rounded-full leading-none">
                -
              </button>
              <span className="px-4">{getQty(product._id)}</span>
              <button onClick={()=>{increment(product._id)}}className="bg-yellow-500 px-4 py-2 rounded-full leading-none">
                +
              </button>
            </div>

            <span>{getSum(product._id,product.price)}</span>
            <button onClick={()=>{handleDelete(product._id)}}className="bg-red-500 px-4 py-2 rounded-full leading-none text-white">
              Delete
            </button>
          </div>
        </li>
          );
        })}
        
      </ul>
      <hr className="my-6"/>
      <div className="text-right font-bold">
        Grand Total : {total}
      </div>
      <div className="text-right mt-6">
        <button onClick={handleOrderNow}className="bg-yellow-500 px-4 py-2 rounded-full leading-none">Order Now</button>
      </div>
    </div>
  );
};

export default Cart;
