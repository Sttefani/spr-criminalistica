// Arquivo: src/auth/auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

// --- Mock do Serviço ---
// Criamos um objeto que simula o método 'login' do AuthService
const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
    // Mockamos o AuthGuard('local') para que ele sempre permita o acesso
    // e possamos testar o controller de forma isolada.
    .overrideGuard(AuthGuard('local'))
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Teste para o endpoint 'login' (POST /auth/login) ---
  describe('login', () => {
    it('should call authService.login and return an access token', async () => {
      // O AuthGuard('local') anexa o usuário validado ao objeto 'req'.
      // Aqui, simulamos esse comportamento.
      const mockUser = { id: 'user-uuid', name: 'Test User' };
      const mockRequest = { user: mockUser };
      const expectedToken = { access_token: 'some-jwt-token' };

      // Configuramos o mock do serviço para retornar o token esperado
      mockAuthService.login.mockResolvedValue(expectedToken);

      // Chamamos o método do controller, passando o request mockado
      const result = await controller.login(mockRequest);

      // Verificamos se o resultado é o esperado
      expect(result).toEqual(expectedToken);
      // Verificamos se o authService.login foi chamado com o usuário correto
      expect(service.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
