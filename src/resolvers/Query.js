const { validateId, getAUserById } = require("../utils/utils")
const { balanceOf } = require("../../web3Services/web3.services");
const { parse } = require("url");




async function allPassengers(parent, args, context) {
  const userDetails = await getAUserById(context);
  return await context.prisma.user.findMany({
    where: { role: 'PASSENGER' },
  }); 
}

async function allPassengersIndex(parent, args, context) {
  const userDetails = await getAUserById(context);
  const result = await context.prisma.user.findMany({
    where: { role: 'PASSENGER' },
  })

  return  Object.keys(result).length;
}

// async function allAirlineAdmins(parent, args, context) {
//   const userDetails = await getAUserById(context);

//   return context.prisma.user.findMany({
//     where: { role: 'AIRLINE' },
//   });
// }

async function allAeropayeAdmins(parent, args, context) {
  const userDetails = await getAUserById(context);
  return context.prisma.user.findMany({
    where: { role: 'ADMIN' },
  });
}

// async function getAUserById(parent, args, context) {
//   const result = await validateId(args, context);
//   if (!result) return null
//   return context.prisma.user.findUnique({
//     where: { id: context?.userId },
//   });
// }

async function getAnAdmin (parent, args, context) {

  const userDetails = await getAUserById(context);

  const details = await context.prisma.user.findUnique({
    where: {
      id: userDetails.id
    }
  })
  return details

} 

async function getAFlightById(parent, args, context) {
  const userDetails = await getAUserById(context);
  const result = await validateId(args, context);
  if (!result) return null
  return context.prisma.flight.findUnique({
    where: { id: context?.userId },
  });
}

async function verifyEmailToken(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function getAvailableFlights(parent, args, context, info) {
  // let options = args.airlineName ? { status: args.status, airlineName: args.airlineName } : { status: args.status }
  const userDetails = await getAUserById(context);
  const flight = await context.prisma.flight.findMany();
  return flight
}
 
async function getAvailableFlightsIndex(parent, args, context, info) {
  // let options = args.airlineName ? { status: args.status, airlineName: args.airlineName } : { status: args.status }
  const userDetails = await getAUserById(context);
  const flight = await context.prisma.flight.findMany(); 

  return Object.keys(flight).length 
} 

// async function getBookedFlightByDanaAir(parent, args, context, info) {

//   const flight = await context.prisma.booked.findMany(
//     {
//     where: {
//       airlineName: "Dana Air",
//       // flightCode: args.flightCode
//     }}
//     )

//   return flight
// } 

// async function getBookedFlightByAirPeace(parent, args, context, info) {

//   const flight = await context.prisma.booked.findMany(
//     {
//     where: {
//       airlineName: "Air Peace",
//       // flightCode: args.flightCode
//     }}
//     )

//   return flight
// } 

async function getAllFlights(parent, args, context, info) {
  const userDetails = await getAUserById(context);
  const flight = await context.prisma.flight.findMany()

  return flight
} 

// async function getBookedFlightByArikAir(parent, args, context, info) {

//   const flight = await context.prisma.booked.findMany(
//     {
//     where: {
//       airlineName: "Arik Air",
//       // flightCode: args.flightCode
//     }}
//     )

//   return flight
// } 

async function getAirlines(parent, args, context, info) {
  // let options = args.airlineName ? { status: args.status, airlineName: args.airlineName } : { status: args.status }
  const userDetails = await getAUserById(context);
  const airlines = await context.prisma.airline.findMany();
  return airlines
}

async function getAirlineIndex(parent, args, context, info) {
  // let options = args.airlineName ? { status: args.status, airlineName: args.airlineName } : { status: args.status }
  const userDetails = await getAUserById(context);
  const airlines = await context.prisma.airline.findMany();

  console.log(airlines)

  return Object.keys(airlines).length 
} 

async function balance(parent, args, context, info) {
  const userDetails = await getAUserById(context);

  console.log("user details", userDetails.addr)

  const escrowTransfer = await balanceOf(userDetails.addr);

  return {
    status: "success",
    data: escrowTransfer.data
  }
}

async function getBookedFlight(parent, args, context, info) {
  // let options = args.airlineName ? { status: args.status, airlineName: args.airlineName } : { status: args.status }
 
  const userDetails = await getAUserById(context);
  const flight = await context.prisma.booked.findMany();
  return flight
}

async function transactions(parent, args, context, info) {
  const userDetails = await getAUserById(context);

  return context.prisma.wallettransactions.findMany(
  //   {
  //   where: { userId: userDetails.id }, 
  // }
  );  
}

async function passengerCancel(parent, args, context, info) {
  const userDetails = await getAUserById(context);

  return context.prisma.passengercancel.findMany();  
}

async function passengerCheckin(parent, args, context, info) {
  const userDetails = await getAUserById(context);

  return context.prisma.passengercheckin.findMany();  
}
 
module.exports = {
  allPassengers, 
  allPassengersIndex,
  // allAirlineAdmins,
  allAeropayeAdmins,
  getAnAdmin,
  getAFlightById,
  // verifyEmailToken,  
  getAvailableFlights,
  getAvailableFlightsIndex,
  getAirlines, 
  getAirlineIndex,
  // getBookedFlightByDanaAir,
  // getBookedFlightByAirPeace,
  // getBookedFlightByArikAir,
  balance,
  getBookedFlight,
  transactions,
  getAllFlights,
  passengerCancel,
  passengerCheckin
};
