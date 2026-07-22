import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload a single file to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }
        try {
            return await this.uploadService.uploadFile(file);
        } catch (error: any) {
            throw new InternalServerErrorException(error?.message || 'File upload failed');
        }
    }

    @Post('base64')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload a file via base64 JSON (works on serverless)' })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    async uploadBase64(@Body() body: { filename: string; mimeType: string; data: string }) {
        if (!body.data || !body.filename) {
            throw new BadRequestException('Missing filename or data');
        }
        try {
            return await this.uploadService.uploadFromBase64(body);
        } catch (error: any) {
            throw new InternalServerErrorException(error?.message || 'File upload failed');
        }
    }

    @Post('multiple')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload multiple files to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }
        return this.uploadService.uploadFiles(files);
    }

    @Get('files')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all uploaded files records' })
    @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
    async getAllFiles() {
        return this.uploadService.getAllFiles();
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a file from Cloudinary and database' })
    @ApiResponse({ status: 200, description: 'File deleted successfully' })
    async deleteFile(@Param('id') id: string) {
        await this.uploadService.deleteFile(id);
        return { message: 'File deleted successfully' };
    }

    @Post('national-id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.EMPLOYEE, Role.SITE_ENGINEER, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload National ID document', description: 'Upload a National ID image or document for attendance/employee records' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'National ID uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadNationalId(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'national_ids');
    }

    @Post('store-bill')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload store bill', description: 'Upload a store bill document for products in/out tracking' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Store bill uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadStoreBill(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'store_bills');
    }

    @Post('material-evidence')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload material evidence', description: 'Upload evidence photo or PDF for used construction materials' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Material evidence uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadMaterialEvidence(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'material_evidence');
    }

    @Post('engineering-report')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ENGINEERING_STUDIO, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload engineering report', description: 'Upload an engineering studio report (PDF, image, video, or document)' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Engineering report uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadEngineeringReport(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'engineering_reports');
    }

    @Post('contract-document')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGER, Role.FINANCE_DIRECTOR)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload contract document', description: 'Upload a contract document (PDF, Word, or other format)' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Contract document uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadContractDocument(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'contracts');
    }

    @Post('project-progress')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload project progress media for client', description: 'Upload images, PDFs, or videos showing project progress to share with client' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 201, description: 'Project progress media uploaded successfully' })
    @UseInterceptors(FileInterceptor('file'))
    async uploadProjectProgress(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        return this.uploadService.uploadFile(file, 'project_progress');
    }
}
