import { BrowserRouter as Router,Switch,Route} from "react-router-dom"; 
import Home from './pages/Home';
import SingleProduct from "./pages/SingleProduct";
// import About from './pages/About';
import Navigation from "./components/Navigation";
import products from "./pages/products";
import Cart from "./pages/Cart";
import { CartContext } from "./CartContext";
import { useEffect, useState } from "react";
import { getCart,storeCart } from "./helper";

const App=() => {
const [cart,setCart]=useState({});

//fetch data from localstorage
useEffect(()=>{
    getCart().then(cart=>setCart(JSON.parse(cart)));
    
},[]);

useEffect(()=>{
    storeCart(cart);
},[cart]);

    return (
        <>
        <Router>
            <CartContext.Provider value={{cart,setCart}}>
            <Navigation/>
            <Switch>
                <Route path='/' component={Home} exact></Route>
                {/* <Route path='/about' component={About}></Route> */}
                <Route path='/products' exact component={products}></Route>
                <Route path='/products/:_id' component={SingleProduct}></Route>
                <Route path='/cart' component={Cart}></Route>
            </Switch>
            </CartContext.Provider>
        </Router>
        
        </>
    )
 }

 export default App;