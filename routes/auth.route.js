const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// /api/auth/registration
router.post('/registration',
	[
		check('email', 'Некоректный email').isEmail(),
		check('password', 'Некоректный пароль').isLength({ min: 5 })
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации'
				})
			}

			const { email, password } = req.body

			const isUsed = await User.findOne({ email })

			if (isUsed) {
				return res.status(300).json({ message: 'Данный Email уже занят, попробуйте другой' })
			}

			const hashPassword = await bcrypt.hash(password, 12)

			const user = new User({
				email, password: hashPassword
			})

			await user.save()
			res.status(201).json({ message: 'Пользователь создан' })

		} catch (e) {
			console.log(e)
		}
	})

// /api/auth/login
router.post('/login',
	[
		check('email', 'Некоректный email').isEmail(),
		check('password', 'Некоректный пароль').exists()
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Некорректные данные при регистрации'
				})
			}

			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: 'Такого пользователя не существует' })
			}

			const isMatch = bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({ message: 'Не верный пароль' })
			}

			const jwtSecret = 'Secret string'

			const token = jwt.sign(
				{ userId: user.id },
				jwtSecret,
				{ expiresIn: '1h' }
			)

			res.json({ token, userId: user.id })


		} catch (e) {
			console.log(e)
		}
	})


module.exports = router