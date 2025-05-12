import Joi from "joi";

export type SizeAvailability = {
    size: number;
    inStock: boolean;
};

export type Shoe = {
    name: string;
    brand: string;
    price: number;
    image: string;
    category: "women" | "men" | "kids";
    sizes: SizeAvailability[];
};

export const shoeSchema = Joi.object<Shoe>({
    name: Joi.string().min(1).max(255).required().messages({
        "string.empty": "Shoe name is required",
        "string.min": "Shoe name must be at least 1 character long",
        "string.max": "Shoe name must be at most 255 characters long"
    }),
    brand: Joi.string().min(1).max(255).required().messages({
        "string.empty": "Brand name is required",
        "string.min": "Brand name must be at least 1 character long",
        "string.max": "Brand name must be at most 255 characters long"
    }),
    price: Joi.number().greater(0).required().messages({
        "number.base": "Price must be a valid number",
        "number.greater": "Price must be greater than 0"
    }),
    image: Joi.string().uri().required().messages({
        "string.uri": "Image must be a valid URL",
        "string.empty": "Image URL is required"
    }),
    category: Joi.string().valid("women", "men", "kids").required().messages({
        "any.only": "Category must be either 'women', 'men', or 'kids'",
        "string.empty": "Category is required"
    }),
    sizes: Joi.array().items(
        Joi.object({
            size: Joi.number().required(),
            inStock: Joi.boolean().required()
        })
    ).min(1).required().messages({
        "array.base": "Sizes should be an array",
        "array.min": "At least one size is required",
        "any.required": "Sizes field is required"
    })
});