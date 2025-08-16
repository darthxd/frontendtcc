import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(cls =>
      cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.grade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  }, [searchTerm, classes]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/schoolclass');
      setClasses(response.data);
    } catch (error) {
      toast.error('Erro ao carregar turmas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingClass) {
        await api.put(`/schoolclass/${editingClass.id}`, data);
        toast.success('Turma atualizada com sucesso!');
      } else {
        await api.post('/schoolclass', data);
        toast.success('Turma criada com sucesso!');
      }
      
      setShowForm(false);
      setEditingClass(null);
      reset();
      fetchClasses();
    } catch (error) {
      toast.error('Erro ao salvar turma');
      console.error('Erro:', error);
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    reset(cls);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        await api.delete(`/schoolclass/${id}`);
        toast.success('Turma excluída com sucesso!');
        fetchClasses();
      } catch (error) {
        toast.error('Erro ao excluir turma');
        console.error('Erro:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClass(null);
    reset();
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Turmas</h1>
          <p className="text-gray-600">Gerencie as turmas do sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </button>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar turmas..."
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
              {editingClass ? 'Editar Turma' : 'Nova Turma'}
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
                  Nome da Turma
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="input"
                  placeholder="Ex: 1º Ano A"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Série/Ano
                </label>
                <input
                  type="text"
                  {...register('grade')}
                  className="input"
                  placeholder="Ex: 1º Ano, 2º Ano"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Turno
                </label>
                <select
                  {...register('shift')}
                  className="input"
                >
                  <option value="">Selecione o turno</option>
                  <option value="MORNING">Manhã</option>
                  <option value="AFTERNOON">Tarde</option>
                  <option value="NIGHT">Noite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade Máxima
                </label>
                <input
                  type="number"
                  {...register('maxCapacity')}
                  className="input"
                  placeholder="Ex: 30"
                  min="1"
                />
              </div>
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
                {editingClass ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de turmas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Série/Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cls.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.grade || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.shift === 'MORNING' ? 'Manhã' : 
                     cls.shift === 'AFTERNOON' ? 'Tarde' : 
                     cls.shift === 'NIGHT' ? 'Noite' : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cls.maxCapacity || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
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
          
          {filteredClasses.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'Nenhuma turma encontrada para esta pesquisa.' : 'Nenhuma turma cadastrada.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classes;
