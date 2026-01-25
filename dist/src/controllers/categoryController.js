import { stat } from "node:fs";
import { prisma } from "../database/prisma.js";
import { z } from "zod";
export const getAllCategory = async (req, res) => {
    const categories = await prisma.category.findMany();
    res.json({
        status: 'success',
        message: 'Categories retrieved successfully',
        data: { categories }
    });
};
export const getACategory = async (req, res) => {
    const categoryId = req.params.id;
    const categoryGetSchema = z.object({
        id: z.uuid(),
    });
    const { success, error } = categoryGetSchema.safeParse({
        id: categoryId,
    });
    if (!success) {
        res.status(400).json({
            status: 'error',
            message: 'validation failed',
        });
    }
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    if (!category) {
        res.status(404).json({
            status: 'error',
            message: 'Category not found',
        });
    }
    res.json({
        status: 'success',
        message: 'Category retrieved successfully',
        data: { category },
    });
};
export const createCategory = async (req, res) => {
    const categoryCreateSchema = z.object({
        name: z.string().min(3),
        description: z.string().min(5),
    });
    /// validation failed
    const { success, data, error } = categoryCreateSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            status: 'error',
            message: 'Bad status',
        });
    }
    const categoryPayload = {
        name: data.name,
        description: data.description
    };
    const createdCategory = await prisma.category.create({
        data: categoryPayload
    });
    res.json({
        status: 'success',
        message: 'Category created successfully',
        data: { category: createdCategory }
    });
};
export const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const categorySchema = z.object({
        id: z.uuid(),
    });
    const { success, data, error } = categorySchema.safeParse({
        id: categoryId,
    });
    if (!success) {
        res.status(400).json({
            status: 'error',
            message: 'validation failed',
        });
    }
    const categoryUpdateSchema = z.object({
        name: z.string().min(3).optional(),
        description: z.string().min(5).optional(),
    });
    const { success: updateSuccess, data: updateData, error: updateError } = categoryUpdateSchema.safeParse(req.body);
    if (!updateSuccess) {
        res.status(400).json({
            status: 'error',
            message: 'Bad request',
        });
    }
    const updatedCategory = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: {
            name: updateData.name,
            description: updateData.description,
        },
    });
    res.json({
        status: 'success',
        message: 'Category updated successfully',
        data: { category: updatedCategory },
    });
};
export const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDeleteSchema = z.object({
        id: z.uuid(),
    });
    const { success, error } = categoryDeleteSchema.safeParse({
        id: categoryId,
    });
    if (!success) {
        res.status(400).json({
            status: 'error',
            message: 'validation failed',
        });
    }
    //we have valid catagories id
    const deletedCategory = await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });
    res.json({
        status: 'success',
        message: 'Category deleted successfully',
        data: { category: deletedCategory },
    });
};
//# sourceMappingURL=categoryController.js.map