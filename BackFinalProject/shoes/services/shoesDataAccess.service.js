import Shoe from "../models/Shoes.schema.js";
import lodash from "lodash";
const { pick } = lodash;

// get shoe by id
const getShoeById = async (shoeId) => {
    try {
        const shoe = await Shoe.findById(shoeId);
        if (!shoe) {
            throw new Error("Shoe not found");
        }
        const returnShoe = pick(shoe, ["name", "image", "_id", "isBusiness", "brand", "price", "sizes", "category"]);
        return returnShoe;
    } catch (err) {
        throw new Error(err.message);
    }
};

// create a new shoe
const createNewShoe = async (shoeData) => {
    try {
        const newShoe = new Shoe(shoeData);
        if (!shoeData) {
            throw new Error("Shoe Was Not Created");
        }
        await newShoe.save();
        return newShoe;
    } catch (err) {
        console.log("Error creating new shoe:", err);
        throw new Error(err.message);
    }
};

// delete a shoe
const deleteShoe = async (shoeId) => {
    try {
        const shoe = await Shoe.findByIdAndDelete(shoeId);
        if (!shoe) {
            throw new Error("Shoe was not found");
        }
        return shoe;
    } catch (err) {
        console.log("Error deleting shoe:", err);
        throw new Error(err.message);
    }
};

// update shoe details
const updateShoe = async (shoeId, shoeData) => {
    try {
        const shoe = await Shoe.findByIdAndUpdate(shoeId, shoeData, { new: true });
        if (!shoe) {
            throw new Error("Shoe Was Not Found");
        }
        return shoe;
    } catch (err) {
        console.log("Error updating shoe:", err);
        throw new Error(err.message);
    }
};

// change authLevel for the user
const changeAuthLevel = async (userId) => {
    try {
        const findUser = await User.findById(userId);
        if (findUser.authLevel === 1) {
            findUser.authLevel = 2;
        }
        await findUser.save();
        return findUser;
    } catch (err) {
        console.log("Error changing auth level:", err);
        throw new Error(err.message);
    }
};

const toggleShoeLike = async (shoeId, userId) => {
    try {
        const shoe = await Shoe.findById(shoeId);
        if (!shoe) {
            throw new Error("Shoe Was Not Found");
        }
        if (shoe.likes.includes(userId)) {
            shoe.likes = shoe.likes.filter(id => id.toString() !== userId);
        } else {
            shoe.likes.push(userId)
        }
        await shoe.save();
        return shoe;
    } catch (err) {
        console.log("Error toggling shoe like:", err);
        throw new Error(err.message);
    }
};

const getUserShoes = async (userId) => {
    try {
        const myShoes = await Shoe.find({ userId: userId });
        if (myShoes.length === 0) {
            throw new Error("You have no shoes yet");
        }
        return myShoes;
    } catch (err) {
        console.log("Error getting user shoes:", err);
        throw new Error(err.message);
    }
};

export { getShoeById, createNewShoe, deleteShoe, updateShoe, changeAuthLevel, toggleShoeLike, getUserShoes };
