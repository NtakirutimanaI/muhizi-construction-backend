import { Controller, Get, Post, Patch, Delete, Body, HttpCode, HttpStatus, UseGuards, Request, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './enums/role.enum';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Create a new user account with email and password. A profile will be automatically created.'
    })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered',
        schema: {
            example: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                email: 'user@example.com',
                isActive: true,
                createdAt: '2024-01-16T10:30:00.000Z',
                updatedAt: '2024-01-16T10:30:00.000Z'
            }
        }
    })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Login user',
        description: 'Authenticate user and receive JWT access and refresh tokens'
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Successfully logged in',
        schema: {
            example: {
                user: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    email: 'user@example.com',
                    isActive: true,
                    profile: {
                        id: '660e8400-e29b-41d4-a716-446655440001',
                        firstName: 'John',
                        lastName: 'Doe'
                    }
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh access token',
        description: 'Exchange a valid refresh token for a new access token and refresh token pair'
    })
    @ApiBody({ type: RefreshDto })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refresh(@Body() refreshDto: RefreshDto) {
        return this.authService.refresh(refreshDto);
    }

    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Request password reset OTP',
        description: 'Send a password reset OTP to the registered email address'
    })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({ status: 200, description: 'If the email exists, an OTP has been sent' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Public()
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset password with OTP',
        description: 'Reset password using email, OTP code, and new password'
    })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get current authenticated user' })
    @ApiResponse({ status: 200, description: 'Current user retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMe(@Request() req) {
        const user = await this.authService.validateUser(req.user.id);
        const { password, refreshToken, ...result } = user;
        return result;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Logout user', description: 'Invalidate refresh token and log out' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async logout(@Request() req) {
        return this.authService.logout(req.user.id);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Change password', description: 'Change current user password (requires current password)' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid current password' })
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all registered users (admin/managing director/finance director)' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async getAllUsers(@Request() req) {
        return this.authService.getAllUsers(req.user.id);
    }

    @Get('users/employed')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.STOREKEEPER, Role.SITE_ENGINEER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get employed users — internal administration staff' })
    @ApiResponse({ status: 200, description: 'Employed users retrieved successfully' })
    async getEmployedUsers() {
        return this.authService.getEmployedUsers();
    }

    @Post('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new user (admin / finance director)' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async createUser(@Body() dto: CreateUserDto) {
        return this.authService.createUser(dto);
    }

    @Get('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get a single user by ID (admin / finance director)' })
    async getUser(@Param('id') id: string) {
        const user = await this.authService.validateUser(id);
        const { password, refreshToken, ...result } = user;
        return result;
    }

    @Patch('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a user (admin / finance director)' })
    @ApiBody({ type: UpdateUserDto })
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.authService.updateUser(id, dto);
    }

    @Delete('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a user (admin / finance director)' })
    async deleteUser(@Param('id') id: string) {
        return this.authService.removeUser(id);
    }

    @Public()
    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Login or register with Google' })
    @ApiResponse({ status: 302, description: 'Redirects to Google OAuth consent screen' })
    async googleAuth() { }

    @Public()
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 200, description: 'Google login successful' })
    async googleAuthRedirect(@Req() req, @Res() res) {
        const result = await this.authService.googleLogin(req.user);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const redirectUrl = `${frontendUrl}/auth/google/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
        return res.redirect(redirectUrl);
    }
}
