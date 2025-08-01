const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/generateToken");

const prisma = new PrismaClient();

const checkEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return res.status(200).json({ exists: true });
    else return res.status(200).json({ exists: false });
  } catch (err) {
    return res.status(500).json({ error: "Failed to check email" });
  }
};

const signup = async (req, res) => {
  const { name, email, phoneNumber, dateOfBirth, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    //parse and normalize the dateOfBirth
    const dob = new Date(dateOfBirth);
    dob.setUTCHours(0, 0, 0, 0); //normalize to UTC midnight

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        dateOfBirth: dob,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { checkEmail, signup, login };
