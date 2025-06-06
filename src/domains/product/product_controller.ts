import z from "zod/v4";
import { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "./product_service";
import { formatError } from "../../shared/utils/errors/formatZodErrors";
import { CategoryParams, categoryParamsSchema, CreateProductBody, createProductBodySchema, ParamsWithId, paramsWithIdSchema, UpdateProductBody, updateProductBodySchema } from "./product_schema";

const productService = new ProductService()


export const productController = {
    async create(request: FastifyRequest<{ Body: CreateProductBody }>, reply: FastifyReply) {
        try {
            const result = createProductBodySchema.safeParse(request.body)

            if (!result.success) {
                return reply.status(400).send({
                    message: "Dados inválidos",
                    errors: formatError(result)
                })
            }

            const product = await productService.createProduct(result.data)
            return reply.status(201).send(product)

        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "Erro ao criar produto",
                    error: error.message
                })
            }
            return reply.status(500).send({
                message: "Erro interno do servidor"
            })
        }
    },

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const products = await productService.findAll()
            return reply.status(200).send(products)
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "Erro ao buscar produtos",
                    error: error.message
                })
            }
            return reply.status(500).send({
                message: "Erro interno do servidor"
            })
        }
    },

    async getById(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        try {
            const result = paramsWithIdSchema.safeParse(request.params)

            if (!result.success) {
                return reply.status(400).send({
                    message: "ID inválido",
                    errors: formatError(result)
                })
            }

            const productId = result.data.id
            const product = await productService.findById(productId)

            return reply.status(200).send(product)
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "Erro ao buscar produto",
                    error: error.message
                })
            }
            return reply.status(500).send({
                message: "Erro interno do servidor"
            })
        }
    },
    async getQuantity(request: FastifyRequest, reply: FastifyReply) {
        try {
            const products = await productService.countProducts()
            return reply.status(200).send(products)
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "Erro ao buscar produtos",
                    error: error.message
                })
            }
            return reply.status(500).send({
                message: "Erro interno do servidor"
            })
        }
    },

    async getLowStock(request: FastifyRequest, reply: FastifyReply) {
        try {
            const products = await productService.findLowStockProducts()
            return reply.status(200).send(products)
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: "Erro ao buscar produtos",
                    error: error.message
                })
            }
            return reply.status(500).send({
                message: "Erro interno do servidor"
            })
        }
    },

    async getByCategory(request: FastifyRequest<{ Params: CategoryParams }>, reply: FastifyReply) {
        const result = categoryParamsSchema.safeParse(request.params)
        if (!result.success) {
            return reply.status(400).send({
                message: 'Categoria Inválida',
                errors: formatError(result)
            })
        }

        const productCategory = result.data.category
        const products = await productService.findByCategory(productCategory)

        return reply.status(200).send(products)

    },

    async update(request: FastifyRequest<{ Params: ParamsWithId, Body: UpdateProductBody }>, reply: FastifyReply) {
        const paramsResult = paramsWithIdSchema.safeParse(request.params)

        if (!paramsResult.success) {
            return reply.status(400).send({
                message: 'ID inválido',
                errors: formatError(paramsResult)
            })
        }


        const bodyResult = updateProductBodySchema.safeParse(request.body)
        if (!bodyResult.success) {
            return reply.status(400).send({
                message: 'Dados inválidos',
                errors: formatError(bodyResult)
            })
        }

        const productId = paramsResult.data.id
        const data = bodyResult.data

        const product = await productService.updateProduct(productId, data)

        return reply.status(200).send(product)
    },

    async delete(request: FastifyRequest<{ Params: ParamsWithId }>, reply: FastifyReply) {
        const result = paramsWithIdSchema.safeParse(request.params)

        if (!result.success) {
            return reply.status(400).send({
                message: 'ID inválido',
                errors: formatError(result)
            })
        }

        const productId = result.data.id
        const user = await productService.delete(productId)

        return reply.send(user)
    }
}