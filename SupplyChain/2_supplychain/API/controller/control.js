
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545');
const conf = require('../../build/contracts/Supply_Chain.json');
const conf2 = require('../../build/contracts/ownwership.json');
const contract_Address = conf.networks['5777'].address;
const contract_Address2 = conf2.networks['5777'].address;
const contract_ABI = conf.abi;
const contract_ABI2 = conf2.abi;
const deploying = new web3.eth.Contract(contract_ABI,contract_Address);
const deploying2 = new web3.eth.Contract(contract_ABI2,contract_Address2);
const { ethers } = require("ethers");
// var flash = require('connect-flash');
let array = [];
const login = (req,res)=>{

    res.render('index');
}

const supplier = async (req,res)=>{
   
    
    const orderdetail = await deploying.methods.partowned().call();
    res.render('supplier',{newListItems:orderdetail}
    );

   // const x = document.getElementById('part-factory-address').value;
    
}

const manufacturer = async (req,res)=>{
    res.render('manufacturer');
}
const makeorder= (req,res)=>{
    res.render('makeorder');
}


const manufacturer_make_order = async (req,res)=>{
    const part = (req.body.parts).toString();
    const exdelidate = (req.body.dd).toString();
    const quantity = (req.body.quantity).toString();
    const d = (req.body.orderdate).toString();
   
    const orderhash = await deploying.methods.create_order(part,exdelidate,d,quantity).call({from:'0x97feB3a48EF2F8fa6ac5d31E3bFC1bAbb9f6DCf9',gas:3000000});
    const orderhash2 = await deploying.methods.create_order(part,exdelidate,d,quantity).send({from:'0x97feB3a48EF2F8fa6ac5d31E3bFC1bAbb9f6DCf9',gas:3000000});
     array.push(orderhash);
    
    res.send(orderhash);
     
    
}
const part_Recepit = async(req,res)=>{
    const orderId = (req.body.orderid).toString();
    orderrecepit=  await deploying.methods.getpartrecepit(orderId).call();
    res.send(orderrecepit);
}

const payment = async(req,res)=>{
    const order = (req.body.orderid).toString();
    const reciver = (req.body.reciver).toString();
    const x = await deploying.methods.getparts(reciver,order).send({from:'0x8a6f56963aB0E9b682585Ffb52DD3492A8Fa583E'});
    res.send(x);
}

const get_orderlist = async (req,res)=>{
    const orderdetail = await deploying.methods.accept_order().call();
       res.render('extra',{newListItems:orderdetail})
}

const supplier_getorder = async (req,res)=>{

    const oid =  (req.body.orderid).toString();
    console.log(oid);
     const orderdetail = await deploying.methods.view_order(oid).call();
     res.send(`<h3>manufacturer : ${orderdetail[0]}  <br>Part type : ${orderdetail[1]} <br>  :Delivered on : ${orderdetail[2]} <br> OrderDate : ${orderdetail[3]} <br> Quantity : ${orderdetail[4]} <br>Time: ${orderdetail[5]}</h3>`);
 }

 const supplier_accept_order = async (req,res)=>{
    const orderdetail = await deploying.methods.get_order(oid).call({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA',gas:100000});
}

const supplier_build_part = async (req,res)=>{
    //res.sendFile(path.join(__dirname, '../client/supplier.html'))
   const order = (req.body.orderid).toString();
   const serial = (req.body.srno).toString();
   const price = (req.body.price).toString();
   const mfg_date = (req.body.mfgdate).toString();
   console.log(order ,
    serial,
    price ,
    mfg_date);
    const hash = await deploying.methods.make_part(order,mfg_date,serial,price).call({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA',gas:300000});
    const hash1 = await deploying.methods.make_part(order,mfg_date,serial,price).send({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA',gas:300000});
    const ownership = await deploying2.methods.add_ownership(0,hash.toString()).send({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA'});
    const recepit= await deploying.methods.partrecepit(order,hash.toString()).send({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA',gas:300000});
    const recepit2= await deploying.methods.partrecepit(order,hash.toString()).call({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA',gas:300000});
    res.send(recepit);
   
}
const change_ownership = async(req,res)=>{
    const to  = (req.body.transferTo).toString();
    const p_hash  =(req.body.part_Hash).toString();
    const orderh = (req.body.Ohash).toString();
   const x = await deploying.getPastEvents('paymentDone',{
    filter: {myIndexedParam: [0,1,2,3], myOtherIndexedParam: 'orderh'},
        fromBlock:'latest'
    });
    console.log(x);
    if(x[0].returnedValues.reciver != null &&
    x[0].returnedValues.amount !=null){
        const ownership = await deploying2.methods.changeOwnership(0,hash.toString()).send({from:'0x93c5877288BA899Cb23368Ee709Bdd071d159BcA'});
        res.send("transfered")
    }
    else
    {
        res.send("payment not done")
    }
    
    

}

const recepit_manufacturer = async(req,res)=>{
    res.render('gres',{code:0})
    
}
const recepit_manufacturer2 = async(req,res)=>{
    const oid =  (req.body.email).toString();
    const orderdetail = await deploying.methods.getpartrecepit(oid).call();
    let y;
    if (orderdetail[4]==3) {
        y="pending"
        
    }
    res.render('gres',{code:1,id:orderdetail[0],supplier:orderdetail[1],price:orderdetail[2],pname:orderdetail[3],payment:y});
    
}


const manufacturer_make_product = async(req,res)=>{
    let  = part_array = [];
    for (let index = 0; index < serial_no.length; index++) {
    part_array.push(await web3.utils.soliditySha3(accounts[0], web3.utils.fromAscii(serial_no[index]),
    web3.utils.fromAscii(parts_type[index]), web3.utils.fromAscii(creation_date)));   
}
    const product_type = (req.body.producttype).toString();
    const serialno = (req.body.srno).toString();
    const price = (req.body.price).toString();
    const creation_date = (req.body.mfgdate).toString();
    const hash = await deploying.methods.make_Product(serialno,product_type,creation_date,part_array,price).call({from:'0x88d431A67dBA450835c1dcA1F7C9B01eF8223D3f',gas:300000});
    const hash1 = await deploying.methods.make_Product(serialno,product_type,creation_date,part_array,price).send({from:'0x88d431A67dBA450835c1dcA1F7C9B01eF8223D3f',gas:300000}); 
    const ownership = await deploying2.methods.add_ownership(0,hash.toString()).send({from:'0x88d431A67dBA450835c1dcA1F7C9B01eF8223D3f'});
    
}

module.exports = {makeorder,manufacturer,get_orderlist,supplier,login,supplier_accept_order,manufacturer_make_order,supplier_build_part ,change_ownership,supplier_getorder,part_Recepit,payment,manufacturer_make_product,recepit_manufacturer ,recepit_manufacturer2}