import { imageToCloudinary } from "../controllers/tweet.controllers";
import { Router } from "express";

const router = Router();

router.route("/imageToCloudinary").post(imageToCloudinary);