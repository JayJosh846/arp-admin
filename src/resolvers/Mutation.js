const { config } = require("dotenv");
config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, getUserId } = require("../utils/auth");
const { sendOTP, verifyOTP } = require("../../termii.token/termii.token");
const { makeFiatDeposit, verifyDepositedFunds } = require("../../payment"); 
const cache = require("../../cache.redis/cache");
const { getAUserById, getAFlightById, isEmailOrMobileExist } = require("../utils/utils");
const { createPassenger, mintToken, transferEscrow } = require('../../web3Services/web3.services');
const { publishToQueue, consumeFromQueue } = require("../../message.queue/queue")
const { PrismaClient } = require("@prisma/client")
const { UserInputError } = require("apollo-server");
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const { abiJSON } = require("../../contractABI/abi");
 

const { getDanaAirFlights, getAirPeaceFlights, getArikAirFlights } = require("../../Services/Airlines/airlines");

const prisma = new PrismaClient()


async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({  
    where: { 
      email: args.email,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  if (user.role !== 'ADMIN') {
    throw new Error("User is not an Admin");
  } else {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return {
      token,
      user,
    };
  }
}

async function balance(parent, args, context, info) {
 
  // const userDetails = await getAUserById(context);
 
  const aeropayeAddress = process.env.CONTRACT;
  // const holderAddress = "0x43DD177A4caE42683B3C693456B9C2f0CF2901E3";

  // just the `balanceOf()` is sufficient in this case

  const contract = new web3.eth.Contract(abiJSON, aeropayeAddress);
  // console.log(contract);
 

  const flightEscrows = await context.prisma.booked.findMany();

  let escrows = flightEscrows.map(a => a.flightEscrow);
  // console.log(escrows);

  let balance;
  let sum = 0; 
  let array = [];



  for (let i = 0; i < escrows.length; i++) {

    balance = await contract.methods.balanceOf(escrows[i]).call();
    array.push(balance);
  }

  // console.log(array); 

  for (let i = 0; i < array.length; i++) {

    let newArray = Math.floor(array[i])
    sum += newArray;
  }
  // console.log(result)
  return sum;




}




module.exports = {
  // signup,
  login,
  balance
  // sendEmailOTP,
  // verifyMobileWithTermiiToken,
  // sendTermiiTokenToMobile,
  // makePayment,
  // mint,
  // bookFlight
  // transferToEscrow
};

