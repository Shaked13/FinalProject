import shoeSchema from "../shoes/models/Shoes.schema.js";

export const isRegisteredUser = (isCard) => async (req, res, next) => {
    try {
        if (isCard) {
            const shoe = await shoeSchema.findById(req.params.id);

            if (!shoe) {
                return res.status(404).json({ message: "הנעל לא נמצאה" });
            }

            if (req.user._id !== shoe.userId.toString()) {
                return res.status(403).json({
                    message: "אין לך הרשאה לבצע פעולה זו",
                });
            }
        } else {
            if (req.user._id !== req.params.id) {
                return res.status(403).json({
                    message: "אין לך הרשאה לבצע פעולה זו (id mismatch)",
                });
            }
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "שגיאה בשרת" });
    }
};