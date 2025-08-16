import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  
  // Observa as mudanças nos campos nome e RM para gerar credenciais
  const watchName = watch('name');
  const watchRm = watch('rm');

  useEffect(() => {
    fetchStudents();
    fetchSchoolClasses();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Gera credenciais automaticamente quando nome ou RM mudam
  useEffect(() => {
    if (!editingStudent && watchName && watchRm) {
      generateCredentials(watchName, watchRm);
    }
  }, [watchName, watchRm, editingStudent]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/student');
      setStudents(response.data);
    } catch (error) {
      toast.error('Erro ao carregar alunos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await api.get('/schoolclass');
      setSchoolClasses(response.data);
    } catch (error) {
      toast.error('Erro ao carregar turmas');
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const generateCredentials = (name, rm) => {
    if (name && rm) {
      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ').slice(-1)[0].toLowerCase();
      const username = `${firstName}.${lastName}`;
      const password = `${firstName}${rm}`;
      
      setGeneratedUsername(username);
      setGeneratedPassword(password);
    } else {
      setGeneratedUsername('');
      setGeneratedPassword('');
    }
  };

  const onSubmit = async (data) => {
    try {
      // Gera username e password automaticamente para novos alunos
      if (!editingStudent) {
        data.username = generatedUsername;
        data.password = generatedPassword;
      }
      
      if (editingStudent) {
        await api.put(`/student/${editingStudent.id}`, data);
        toast.success('Aluno atualizado com sucesso!');
      } else {
        await api.post('/student', data);
        toast.success('Aluno criado com sucesso!');
      }
      
      setShowForm(false);
      setEditingStudent(null);
      reset();
      fetchStudents();
    } catch (error) {
      toast.error('Erro ao salvar aluno');
      console.error('Erro:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    // Mapeia os dados do aluno para o formulário, incluindo o schoolClassId
    const formData = {
      ...student,
      schoolClassId: student.schoolClass?.id || ''
    };
    reset(formData);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await api.delete(`/student/${id}`);
        toast.success('Aluno excluído com sucesso!');
        fetchStudents();
      } catch (error) {
        toast.error('Erro ao excluir aluno');
        console.error('Erro:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
    setGeneratedUsername('');
    setGeneratedPassword('');
    reset({
      name: '',
      cpf: '',
      rm: '',
      ra: '',
      email: '',
      phone: '',
      birthdate: '',
      schoolClassId: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos do sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Aluno
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar alunos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingStudent ? 'Editar Aluno' : 'Cadastrar Aluno'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="input"
                  placeholder="Nome completo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  {...register('cpf', { required: 'CPF é obrigatório' })}
                  className="input"
                  placeholder="111.222.333-44"
                  maxLength={11}
                />
                {errors.cpf && (
                  <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RM
                </label>
                <input
                  type="text"
                  {...register('rm', { required: 'RM é obrigatório' })}
                  className="input"
                  placeholder="RM"
                  maxLength={5}
                />
                {errors.rm && (
                  <p className="mt-1 text-sm text-red-600">{errors.rm.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RA
                </label>
                <input
                  type="text"
                  {...register('ra', { required: 'RA é obrigatório' })}
                  className="input"
                  placeholder="RA"
                  maxLength={13}
                />
                {errors.ra && (
                  <p className="mt-1 text-sm text-red-600">{errors.ra.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  className="input"
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="input"
                  placeholder="(11) 99999-9999"
                  maxLength={11}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...register('birthdate')}
                  className="input"
                />
              </div>

                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Turma
                 </label>
                 <select
                   {...register('schoolClassId', { required: 'Turma é obrigatória' })}
                   className="input bg-white"
                   disabled={loadingClasses}
                   defaultValue=""
                 >
                   <option value="">Selecione uma turma</option>
                   {schoolClasses.map((schoolClass) => (
                     <option key={schoolClass.id} value={schoolClass.id}>
                       {schoolClass.name}
                     </option>
                   ))}
                 </select>
                 {errors.schoolClassId && (
                   <p className="mt-1 text-sm text-red-600">{errors.schoolClassId.message}</p>
                 )}
                 {loadingClasses && (
                   <p className="mt-1 text-sm text-gray-500">Carregando turmas...</p>
                 )}
               </div>

               {/* Campos ocultos para credenciais (apenas para novos alunos) */}
               {!editingStudent && (
                 <>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Username (gerado automaticamente)
                     </label>
                     <input
                       type="text"
                       className="input bg-gray-100 cursor-not-allowed"
                       value={generatedUsername}
                       readOnly
                       placeholder="Será gerado automaticamente"
                     />
                     <p className="mt-1 text-sm text-gray-500">
                       Formato: primeiro.nome
                     </p>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                       Senha (gerada automaticamente)
                     </label>
                     <input
                       type="text"
                       className="input bg-gray-100 cursor-not-allowed"
                       value={generatedPassword}
                       readOnly
                       placeholder="Será gerada automaticamente"
                     />
                     <p className="mt-1 text-sm text-gray-500">
                       Formato: primeiroNome + RM
                     </p>
                   </div>
                 </>
               )}



            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingStudent ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de alunos */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Série/Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Nascimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.cpf ? student.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone ? student.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.schoolClass ? `${student.schoolClass.name}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.schoolClass.grade === 'FIRST_YEAR' ? 'Primeiro ano' : 
                     student.schoolClass.grade === 'SECOND_YEAR' ? 'Segundo ano' : 
                     student.schoolClass.grade === 'THIRD_YEAR' ? 'Terceiro ano' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.schoolClass.shift === 'MORNING' ? 'Manhã' : 
                     student.schoolClass.shift === 'AFTERNOON' ? 'Tarde' : 
                     student.schoolClass.shift === 'NIGHT' ? 'Noite' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.birthdate ? new Date(student.birthdate).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum aluno encontrado para esta pesquisa.' : 'Nenhum aluno cadastrado.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
