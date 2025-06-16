import userModel from "../../models/User.js";

export const signUp_get = async (req, res) => {
  res.render("registration/signUp", { title: "Sign up" });
};

export const signUp_post = async (req, res) => {
  try {
    const { email, username, password, fullName, gender, phone, city } = req.body;

    const profilePicture = req.file
      ? `/uploads/users/${req.file.filename}`
      : undefined;

    if (await userModel.findOne({ email }))
      return res.status(409).json({ errMsg: "Email is taken" });
    if (await userModel.findOne({ username }))
      return res.status(409).json({ errMsg: "Username is taken" });

    const newUser = await userModel.create({
      email,
      username,
      password,
      fullName,
      gender,
      phone,
      city,
      ...(profilePicture && { profilePicture })
    });

    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ errMsg: err.message });
  }
};
