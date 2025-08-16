import { IsString, IsNotEmpty, IsEmail, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { Transform } from 'class-transformer';

// Esta classe é nosso "formulário de criação de usuário"
export class CreateUserDto {

  // @IsString() -> Garante que o valor recebido é um texto.
  // @IsNotEmpty() -> Garante que o texto não está vazio.
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsEmail() -> Garante que o texto tem um formato de e-mail válido.
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsCPF(...) -> Usa a biblioteca que instalamos para validar o CPF.
  // A 'message' é o texto que aparecerá se a validação falhar.
  @IsCPF({ message: 'O CPF informado é inválido.' })
  @IsNotEmpty()
  cpf: string;

  // @IsOptional() -> Diz que este campo não é obrigatório.
  // @IsPhoneNumber('BR', ...) -> Valida se é um telefone no padrão brasileiro.
  // @Transform(...) -> Esta é a mágica que limpa o número. Ele pega o valor
  // (ex: "(95) 99114-3501") e remove tudo que não for dígito,
  // resultando em "95991143501" antes mesmo de validar.
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O número de telefone informado é inválido.' })
  @Transform(({ value }) => value ? value.replace(/\D/g, '') : value)
  phone?: string;

  @IsString()
  @IsOptional()
  institution?: string;

  // @MinLength(8, ...) -> Garante que a senha tenha no mínimo 8 caracteres.
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;
}