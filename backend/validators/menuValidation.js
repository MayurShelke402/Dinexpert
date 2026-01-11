import { body } from 'express-validator';

export const menuItemValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('vegOrNonVeg')
    .trim()
    .isIn(['Veg', 'Non-Veg', 'Vegan'])
    .withMessage('vegOrNonVeg must be one of Veg, Non-Veg, Vegan'),

  body('servingSize')
    .optional()
    .isString()
    .withMessage('Serving size must be a string'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .custom(value => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 1) throw new Error('Price must be a number >= 1');
      return true;
    }),

  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('timeRequired')
    .optional()
    .isString()
    .withMessage('Time required must be a string'),

  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),
];
