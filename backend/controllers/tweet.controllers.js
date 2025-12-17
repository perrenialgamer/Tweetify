import {asyncHandler} from '../utils/asyncHandler.js';

const imageToCloudinary = asyncHandler(async (req, res) => {
     const { image } = req.body;
     console.log(image);
     res.status(200).send('Image uploaded');
     }
)

export { imageToCloudinary };