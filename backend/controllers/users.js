const User = require("../models/users");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

module.exports.fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res
      .status(200)
      .json({ message: "Users Fetched Successfully", users });
  } catch (error) {
    console.error("Error Fetching Users", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      workEmail,
      gender,
      nationality,
      contact,
      role,
      teams,
      status,
      dob,
    } = req.body;

    const profilePic = req.file ? req.file.path : null;

    if (
      !name ||
      !email ||
      !workEmail ||
      !gender ||
      !nationality ||
      !contact ||
      !role ||
      !teams ||
      !dob
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const teamsArray = Array.isArray(teams)
      ? teams
      : teams.split(",").map((team) => team.trim());

    const newUser = new User({
      name,
      email,
      workEmail,
      gender,
      nationality,
      contact,
      role,
      teams: teamsArray,
      profilePic,
      status,
      dob: new Date(dob),
    });

    if (profilePic) {
      const cloudinaryUrl = cloudinary.url(profilePic, {
        secure: true,
      });
      newUser.profilePic = cloudinaryUrl;
    }

    await newUser.save();

    res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const result = await User.findByIdAndDelete(_id);

    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const { name, email, role, teams, status, _id } = req.body;

    const profilePic = req.file ? req.file.filename : null;

    if (!name || !email || !status || !role || !teams) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const teamsArray = Array.isArray(teams)
      ? teams
      : teams.split(",").map((team) => team.trim());

    const updateData = {
      name,
      email,
      role,
      teams: teamsArray,
      status,
      profilePic,
    };

    if (profilePic) {
      const cloudinaryUrl = cloudinary.url(profilePic, {
        secure: true,
      });
      updateData.profilePic = cloudinaryUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
