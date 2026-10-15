const User = require("../models/User");
const Habit = require("../models/HabitLogs");
const mongoose = requirer("mongoose");
const {calculateSimilarity}= require("../utils/similarity")

exports.getSimilarUsers = async (req,res) =>{
  try{
    const {userId} =req.params;

    if(!mongoose.isValidObjectId(userId)){
      return res.status(400).json({
        message:"Invalud user Id"
      });
    }
    const authenticatedUserId = req.user?.id || req.user?._id;

    if(!authenticatedUserId){
      return res.status(401).json({
        message: "Authentication required"
      });
    }
    
  if(String(authenticatedUserId) !== String(userId)){
    return res.status(403).json({
      message: "You are not authorized to access these results"
    });
  }

    const currentUser=await User.findById(userId).select("_id name").lena(;);

    if(!currentUser){
      return res.status(404).json({
        message: "User not found"
      });
    }
    
    const allHabits=await Habit.find({
      isArchived: {$ne: true}
    }).select("_id user name category schedule completedDates").lean();

    const habitsByUser = new Map();

    for(const habit of allHabits){
      const ownerId = String(habit.user);

      if(!habitsByUser.has(ownerId)){
        habitsByUser.set(ownerId, []);
      }
      habitsByUser.get(ownerId).push(habit);
    }

    const currentHabits =  habitsByUser.get(String(userId)) || [];

    if(!currentHabits.length) {
      return res.json({
        users: [],
        followingDays: FollowingDays,
        message: "Create active habits to discover similar users"
      });
    }

    const candidateIds = [...habitsByUser.keys()].
    filter(id =? id!==String(userId));

    const candidateUsers = await User.find({
      id: {$ne : candidateIds}
    }).select("_id name").lean();

    const results=[];

    for(const user of candidateUsers){
      const otherHabits = habitsByUser.get(String(user._id)) || []
    }
  }
}