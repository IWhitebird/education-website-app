import Category from "../models/Category";
import { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
    try{
        const {name , description} = req.body;

        if(!name || !description){
            return res.status(400).json({success : false , message: "Please enter all fields"});
        }

        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        });

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: CategoryDetails,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in createCategory"});
    }
};

export async function showAllCategory(req: Request, res: Response) {
    try{
        const allCategory = await Category.find({});
        res.status(200).json({
            success: true,
            message: "All Category retrieved successfully",
            allCategory,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success : false , message: "Internal server error in showAllCategory"});
    }
};

export async function categoryPageDetails(req: Request, res: Response) {
    try{
        const { categoryId } = req.body;

        const selectedCategory = await  Category.findById(categoryId)
                                                                    .populate("course")
                                                                    .exec();
        
        if(!selectedCategory){
            return res.status(400).json({success : false , message: "Category not found"});
        }    
        
        const differentCategory = await Category.find({_id:{$ne:categoryId}})
                                                                            .populate("course")
                                                                            .exec();
        //Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
            path: "course",
            match: { status: "Published" },
            populate: {
            path: "instructor",
            },
        })
        .exec();
        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses
        .sort((a : any, b : any) => b.sold - a.sold)
        .slice(0, 10);
        
        //MY LOGIC
        //  const allCategories = await Category.find().populate({
        //     path: "course",
        //     populate: { path: "studentsEnrolled" },
        //   }).exec();
        //   const allCourses = allCategories.flatMap((category) => category.course);
        //   const mostSellingCourses = allCourses.sort((a : any, b : any) => b.studentsEnrolled.length - a.studentsEnrolled.length);
          

        return res.status(200).json({
            success: true,
            message: "Category page details retrieved successfully",
            selectedCategory,
            differentCategory,
            mostSellingCourses,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success : false , message: "Internal server error in categoryPageDetails"});
    }
}