import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";import { hp, wp, RF } from "../../utils/responsive";


export default function TransactionCard({ item = {} }) {


  const isCredit =
    item?.type === "recharge" ||
    item?.type === "credit";


  const amount =
    Number(item?.amount || 0)
      .toFixed(2);



  const date = item?.createdAt
    ? new Date(item.createdAt)
        .toLocaleDateString("en-IN",{
          day:"2-digit",
          month:"short",
          year:"numeric",
        })
    : "";



  const status =
    item?.type === "recharge"
      ? "Success"
      : "Completed";



  return (

    <View style={styles.card}>


      {/* Left Icon */}

      <View
        style={[
          styles.iconBox,
          {
            backgroundColor:
              isCredit
              ? "#EAF9EF"
              : "#FFF4ED",
          },
        ]}
      >

        <Ionicons
          name={
            isCredit
            ? "arrow-down-outline"
            : "arrow-up-outline"
          }

          size={RF(22)}

          color={
            isCredit
            ? "#1FA34A"
            : Colors.primary
          }

        />

      </View>



      {/* Center */}

      <View style={styles.info}>


        <Text style={styles.title}>

          {
            item?.description ||
            "Wallet Transaction"
          }

        </Text>



        <Text style={styles.date}>

          {date}

        </Text>


      </View>



      {/* Right */}

      <View style={styles.amountContainer}>


        <Text
          style={[
            styles.amount,
            {
              color:
              isCredit
              ? "#1FA34A"
              : Colors.primary,
            },
          ]}
        >

          {isCredit ? "+" : "-"} ₹{amount}

        </Text>



        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
              status === "Success"
              ? "#EAF9EF"
              : "#FFF3E6",
            },
          ]}
        >

          <Text
            style={[
              styles.status,
              {
                color:
                status === "Success"
                ? "#1FA34A"
                : "#F59E0B",
              },
            ]}
          >

            {status}

          </Text>


        </View>


      </View>


    </View>

  );
}



const styles = StyleSheet.create({


  card: {

    flexDirection:"row",

    alignItems:"center",

    backgroundColor:Colors.white,

    marginHorizontal:wp(4),

    marginBottom:hp(1.4),

    padding:wp(3.5),

    borderRadius:wp(4),

    elevation:2,


    shadowColor:"#000",

    shadowOpacity:0.06,

    shadowRadius:4,

    shadowOffset:{
      width:0,
      height:2,
    },

  },



  iconBox:{


    width:wp(14),

    height:wp(14),

    borderRadius:wp(7),


    justifyContent:"center",

    alignItems:"center",


  },



  info:{


    flex:1,

    marginLeft:wp(3),


  },



  title:{


    color:Colors.darkBrown,

    fontSize:RF(14),

    fontWeight: "600",


    maxWidth:wp(45),


  },



  date:{


    marginTop:hp(0.4),

    color:Colors.textGray,

    fontSize:RF(12),

    fontWeight: "400",


  },



  amountContainer:{


    alignItems:"flex-end",


  },



  amount:{


    fontSize:RF(15),

    fontWeight: "600",


  },



  statusBadge:{


    marginTop:hp(0.6),

    paddingHorizontal:wp(2.5),

    paddingVertical:hp(0.35),

    borderRadius:wp(4),


  },



  status:{


    fontSize:RF(10),

    fontWeight: "600",


  },


});