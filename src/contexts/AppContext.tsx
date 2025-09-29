import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Client {
  id: string;
  name: string;
  type: 'pf' | 'pj'; // Pessoa Física ou Jurídica
  cpf?: string;
  cnpj?: string;
  email: string;
  phone: string;
  mobile: string;
  razao_social?: string;
  inscricao_estadual?: string;
  isento_icms?: boolean;
  numero?: string;
  complemento?: string;
  id_empresa?: string;
  fl_ativo: boolean;
  address: {
    country: string;
    state: string;
    city: string;
    zipCode: string;
    neighborhood: string;
    streetType: string;
    street: string;
  };
  created_at: string;
  total_projects?: number;
  total_value?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  components: ProductComponent[];
  created_at: string;
}

export interface ProductComponent {
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  current_price: number;
  price_history: PriceHistory[];
  created_at: string;
}

export interface PriceHistory {
  date: string;
  price: number;
  supplier?: string;
}

export interface ProjectProduct {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Project {
  id: string;
  number: number;
  client_id: string;
  client_name?: string;
  title: string;
  description: string;
  status: 'orcamento' | 'aprovado' | 'em_producao' | 'concluido' | 'entregue';
  type: 'orcamento' | 'venda';
  products: ProjectProduct[];
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  materials_cost?: number;
  labor_cost?: number;
  profit_margin?: number;
  payment_terms?: PaymentTerms;
}

export interface PaymentTerms {
  installments: number;
  payment_method: 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia';
  discount_percentage: number;
  installment_value?: number;
  total_with_discount?: number;
}

export interface Transaction {
  id: string;
  project_id?: string;
  project_title?: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface StockMovement {
  id: string;
  material_id: string;
  material_name: string;
  type: 'entrada' | 'saida';
  quantity: number;
  unit_price?: number;
  total_value?: number;
  project_id?: string;
  project_title?: string;
  date: string;
  created_at: string;
}

interface AppContextType {
  clients: Client[];
  projects: Project[];
  transactions: Transaction[];
  products: Product[];
  materials: Material[];
  stockMovements: StockMovement[];
  addClient: (client: Omit<Client, 'id' | 'created_at'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'number'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMaterial: (material: Omit<Material, 'id' | 'created_at'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'created_at'>) => void;
  processProjectStockMovement: (projectId: string, products: ProjectProduct[]) => void;
  exportClientsCSV: () => void;
  exportProductsCSV: () => void;
  exportProjectsCSV: () => void;
  exportTransactionsCSV: () => void;
  importClientsCSV: (file: File) => Promise<void>;
  importProductsCSV: (file: File) => Promise<void>;
  importProjectsCSV: (file: File) => Promise<void>;
  importTransactionsCSV: (file: File) => Promise<void>;
  getDashboardStats: () => {
    totalClients: number;
    activeProjects: number;
    monthlyRevenue: number;
    pendingPayments: number;
    lowStockItems: number;
    recentActivity: any[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  // Carregar dados iniciais simulados
  useEffect(() => {
    // Materiais de exemplo
    setMaterials([
      {
        id: '1',
        name: 'MDF 15mm',
        description: 'Placa de MDF 15mm 2,75x1,83m',
        category: 'Painéis',
        unit: 'UN',
        current_stock: 50,
        min_stock: 10,
        current_price: 85.50,
        price_history: [
          { date: '2024-01-01', price: 80.00 },
          { date: '2024-02-01', price: 85.50 }
        ],
        created_at: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Dobradiça 35mm',
        description: 'Dobradiça de pressão 35mm',
        category: 'Ferragens',
        unit: 'UN',
        current_stock: 200,
        min_stock: 50,
        current_price: 12.50,
        price_history: [
          { date: '2024-01-01', price: 11.00 },
          { date: '2024-02-01', price: 12.50 }
        ],
        created_at: '2024-01-01T10:00:00Z'
      }
    ]);

    // Produtos de exemplo
    setProducts([
      {
        id: '1',
        name: 'Porta de Armário 40x60cm',
        description: 'Porta padrão para armário de cozinha',
        category: 'Portas',
        unit: 'UN',
        components: [
          { material_id: '1', material_name: 'MDF 15mm', quantity: 0.5, unit: 'UN' },
          { material_id: '2', material_name: 'Dobradiça 35mm', quantity: 2, unit: 'UN' }
        ],
        created_at: '2024-01-01T10:00:00Z'
      }
    ]);

    // Clientes de exemplo
    setClients([
      {
        id: '1',
        name: 'João Silva',
        type: 'pf',
        cpf: '123.456.789-00',
        email: 'joao@email.com',
        phone: '(11) 3333-3333',
        mobile: '(11) 99999-9999',
        fl_ativo: true,
        address: {
          country: 'Brasil',
          state: 'SP',
          city: 'São Paulo',
          zipCode: '01234-567',
          neighborhood: 'Centro',
          streetType: 'Rua',
          street: 'das Flores, 123'
        },
        created_at: '2024-01-15T10:00:00Z',
        total_projects: 1,
        total_value: 12000
      }
    ]);

    // Projetos de exemplo
    setProjects([
      {
        id: '1',
        number: 1,
        client_id: '1',
        client_name: 'João Silva',
        title: 'Cozinha Sob Medida',
        description: 'Cozinha completa em MDF branco',
        status: 'em_producao',
        type: 'venda',
        products: [
          {
            id: '1',
            product_id: '1',
            product_name: 'Porta de Armário 40x60cm',
            quantity: 10,
            unit_price: 150.00,
            total_price: 1500.00
          }
        ],
        budget: 12000,
        start_date: '2024-02-01',
        end_date: '2024-03-15',
        created_at: '2024-01-20T09:00:00Z',
        materials_cost: 8000,
        labor_cost: 2000,
        profit_margin: 20,
        payment_terms: {
          installments: 3,
          payment_method: 'cartao_credito',
          discount_percentage: 0,
          installment_value: 4000,
          total_with_discount: 12000
        }
      }
    ]);

    // Transações de exemplo
    setTransactions([
      {
        id: '1',
        project_id: '1',
        project_title: 'Cozinha Sob Medida',
        type: 'entrada',
        category: 'Sinal',
        description: 'Sinal do projeto - Cozinha João Silva',
        amount: 6000,
        date: '2024-02-01',
        created_at: '2024-02-01T10:00:00Z'
      }
    ]);
  }, []);

  const addClient = (clientData: Omit<Client, 'id' | 'created_at'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      total_projects: 0,
      total_value: 0,
      fl_ativo: clientData.fl_ativo ?? true
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updates } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
    setProjects(prev => prev.filter(project => project.client_id !== id));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'created_at' | 'number'>) => {
    const client = clients.find(c => c.id === projectData.client_id);
    const projectNumber = Math.max(...projects.map(p => p.number), 0) + 1;
    
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      number: projectNumber,
      created_at: new Date().toISOString(),
      client_name: client?.name || ''
    };
    
    setProjects(prev => [...prev, newProject]);
    
    // Só adiciona transação se for uma venda aprovada
    if (projectData.type === 'venda' && projectData.status !== 'orcamento') {
      const signalAmount = projectData.budget * 0.5;
      addTransaction({
        project_id: newProject.id,
        project_title: projectData.title,
        type: 'entrada',
        category: 'Sinal',
        description: `Sinal do projeto #${projectNumber} - ${projectData.title}`,
        amount: signalAmount,
        date: new Date().toISOString().split('T')[0]
      });
    }
    
    // Processa movimentação de estoque
    if (projectData.products && projectData.products.length > 0) {
      processProjectStockMovement(newProject.id, projectData.products);
    }
    
    // Atualiza estatísticas do cliente
    updateClient(projectData.client_id, {
      total_projects: (client?.total_projects || 0) + 1,
      total_value: (client?.total_value || 0) + projectData.budget
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
    
    // Se o status mudou para 'concluido', adiciona a transação final automaticamente
    if (updates.status === 'concluido' && project && project.status !== 'concluido') {
      const remainingAmount = project.budget * 0.5;
      addTransaction({
        project_id: id,
        project_title: project.title,
        type: 'entrada',
        category: 'Pagamento Final',
        description: `Pagamento final - Projeto #${project.number}`,
        amount: remainingAmount,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setTransactions(prev => prev.filter(transaction => transaction.project_id !== id));
    setStockMovements(prev => prev.filter(movement => movement.project_id !== id));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const addMaterial = (materialData: Omit<Material, 'id' | 'created_at'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setMaterials(prev => [...prev, newMaterial]);
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, ...updates } : material
    ));
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  const addStockMovement = (movementData: Omit<StockMovement, 'id' | 'created_at'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setStockMovements(prev => [...prev, newMovement]);

    // Atualiza o estoque do material
    setMaterials(prev => prev.map(material => {
      if (material.id === movementData.material_id) {
        const newStock = movementData.type === 'entrada' 
          ? material.current_stock + movementData.quantity
          : material.current_stock - movementData.quantity;
        
        return { ...material, current_stock: Math.max(0, newStock) };
      }
      return material;
    }));
  };

  const processProjectStockMovement = (projectId: string, projectProducts: ProjectProduct[]) => {
    const project = projects.find(p => p.id === projectId);
    
    projectProducts.forEach(projectProduct => {
      const product = products.find(p => p.id === projectProduct.product_id);
      if (product) {
        product.components.forEach(component => {
          const totalQuantityNeeded = component.quantity * projectProduct.quantity;
          
          addStockMovement({
            material_id: component.material_id,
            material_name: component.material_name,
            type: 'saida',
            quantity: totalQuantityNeeded,
            project_id: projectId,
            project_title: project?.title,
            date: new Date().toISOString().split('T')[0]
          });
        });
      }
    });
  };

  // Funções de exportação CSV
  const exportClientsCSV = () => {
    const headers = [
      'tipo', 'nome', 'endereco', 'tipopessoa', 'fone_comercial', 'fone_celular', 
      'cep', 'cidade', 'email', 'cpf_cnpj', 'inscricao_estadual', 'bairro', 
      'complemento', 'numero', 'isento_icms', 'razao_social', 'id_empresa', 'fl_ativo'
    ];
    
    const csvContent = [
      headers.join(','),
      ...clients.map(client => [
        'Cliente',
        `"${client.name}"`,
        `"${client.address.streetType} ${client.address.street}"`,
        client.type === 'pj' ? 'J' : 'F',
        `"${client.phone}"`,
        `"${client.mobile}"`,
        `"${client.address.zipCode}"`,
        `"${client.address.city}"`,
        `"${client.email}"`,
        `"${client.type === 'pj' ? client.cnpj : client.cpf}"`,
        `"${client.inscricao_estadual || ''}"`,
        `"${client.address.neighborhood}"`,
        `"${client.complemento || ''}"`,
        `"${client.numero || ''}"`,
        client.isento_icms ? 'true' : 'false',
        `"${client.razao_social || ''}"`,
        `"${client.id_empresa || ''}"`,
        client.fl_ativo ? 'true' : 'false'
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'clientes.csv');
  };

  const exportProductsCSV = () => {
    const headers = ['id', 'nome', 'descricao', 'categoria', 'unidade', 'componentes'];
    
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        `"${product.id}"`,
        `"${product.name}"`,
        `"${product.description}"`,
        `"${product.category}"`,
        `"${product.unit}"`,
        `"${product.components.map(c => `${c.material_name}:${c.quantity}`).join(';')}"`
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'produtos.csv');
  };

  const exportProjectsCSV = () => {
    const headers = [
      'numero', 'cliente', 'titulo', 'descricao', 'status', 'tipo', 'orcamento', 
      'data_inicio', 'data_fim', 'custo_materiais', 'custo_mao_obra', 'margem_lucro'
    ];
    
    const csvContent = [
      headers.join(','),
      ...projects.map(project => [
        project.number,
        `"${project.client_name}"`,
        `"${project.title}"`,
        `"${project.description}"`,
        `"${project.status}"`,
        `"${project.type}"`,
        project.budget,
        `"${project.start_date}"`,
        `"${project.end_date}"`,
        project.materials_cost || 0,
        project.labor_cost || 0,
        project.profit_margin || 0
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'projetos.csv');
  };

  const exportTransactionsCSV = () => {
    const headers = ['tipo', 'categoria', 'descricao', 'valor', 'data', 'projeto'];
    
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        `"${transaction.type}"`,
        `"${transaction.category}"`,
        `"${transaction.description}"`,
        transaction.amount,
        `"${transaction.date}"`,
        `"${transaction.project_title || ''}"`
      ].join(','))
    ].join('\n');
    
    downloadCSV(csvContent, 'transacoes.csv');
  };

  // Funções de importação CSV
  const importClientsCSV = async (file: File): Promise<void> => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      if (values.length < headers.length) continue;
      
      const clientData: Omit<Client, 'id' | 'created_at'> = {
        name: values[1] || '',
        type: values[3] === 'J' ? 'pj' : 'pf',
        cpf: values[3] === 'F' ? values[9] : undefined,
        cnpj: values[3] === 'J' ? values[9] : undefined,
        email: values[8] || '',
        phone: values[4] || '',
        mobile: values[5] || '',
        razao_social: values[15] || undefined,
        inscricao_estadual: values[10] || undefined,
        isento_icms: values[14] === 'true',
        numero: values[13] || undefined,
        complemento: values[12] || undefined,
        id_empresa: values[16] || undefined,
        fl_ativo: values[17] !== 'false',
        address: {
          country: 'Brasil',
          state: '',
          city: values[7] || '',
          zipCode: values[6] || '',
          neighborhood: values[11] || '',
          streetType: 'Rua',
          street: values[2] || ''
        },
        total_projects: 0,
        total_value: 0
      };
      
      addClient(clientData);
    }
  };

  const importProductsCSV = async (file: File): Promise<void> => {
    const text = await file.text();
    const lines = text.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      if (values.length < 5) continue;
      
      const productData: Omit<Product, 'id' | 'created_at'> = {
        name: values[1] || '',
        description: values[2] || '',
        category: values[3] || '',
        unit: values[4] || 'UN',
        components: []
      };
      
      addProduct(productData);
    }
  };

  const importProjectsCSV = async (file: File): Promise<void> => {
    const text = await file.text();
    const lines = text.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      if (values.length < 8) continue;
      
      // Encontrar cliente pelo nome
      const client = clients.find(c => c.name === values[1]);
      if (!client) continue;
      
      const projectData: Omit<Project, 'id' | 'created_at' | 'number'> = {
        client_id: client.id,
        client_name: values[1],
        title: values[2] || '',
        description: values[3] || '',
        status: (values[4] as any) || 'orcamento',
        type: (values[5] as any) || 'orcamento',
        products: [],
        budget: parseFloat(values[6]) || 0,
        start_date: values[7] || new Date().toISOString().split('T')[0],
        end_date: values[8] || new Date().toISOString().split('T')[0],
        materials_cost: parseFloat(values[9]) || 0,
        labor_cost: parseFloat(values[10]) || 0,
        profit_margin: parseFloat(values[11]) || 20
      };
      
      addProject(projectData);
    }
  };

  const importTransactionsCSV = async (file: File): Promise<void> => {
    const text = await file.text();
    const lines = text.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      if (values.length < 5) continue;
      
      const transactionData: Omit<Transaction, 'id' | 'created_at'> = {
        type: (values[0] as any) || 'entrada',
        category: values[1] || '',
        description: values[2] || '',
        amount: parseFloat(values[3]) || 0,
        date: values[4] || new Date().toISOString().split('T')[0],
        project_title: values[5] || undefined
      };
      
      addTransaction(transactionData);
    }
  };

  // Função auxiliar para fazer download do CSV
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função auxiliar para parsear linha CSV
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const getDashboardStats = () => {
    const totalClients = clients.length;
    const activeProjects = projects.filter(p => 
      p.status === 'em_producao' || p.status === 'aprovado'
    ).length;
    
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = transactions
      .filter(t => 
        t.type === 'entrada' && 
        new Date(t.date).getMonth() === currentMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const pendingPayments = projects
      .filter(p => p.status === 'concluido' || p.status === 'entregue')
      .reduce((sum, p) => sum + (p.budget * 0.5), 0);
    
    const lowStockItems = materials.filter(m => m.current_stock <= m.min_stock).length;
    
    const recentActivity = [
      ...projects.slice(-3).map(p => ({
        type: 'project',
        message: `Novo projeto #${p.number}: ${p.title}`,
        date: p.created_at
      })),
      ...transactions.slice(-3).map(t => ({
        type: 'transaction',
        message: `${t.type === 'entrada' ? 'Recebimento' : 'Pagamento'}: R$ ${t.amount.toLocaleString()}`,
        date: t.created_at
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    return {
      totalClients,
      activeProjects,
      monthlyRevenue,
      pendingPayments,
      lowStockItems,
      recentActivity
    };
  };

  return (
    <AppContext.Provider value={{
      clients,
      projects,
      transactions,
      products,
      materials,
      stockMovements,
      addClient,
      updateClient,
      deleteClient,
      addProject,
      updateProject,
      deleteProject,
      addTransaction,
      addProduct,
      updateProduct,
      deleteProduct,
      addMaterial,
      updateMaterial,
      deleteMaterial,
      addStockMovement,
      processProjectStockMovement,
      exportClientsCSV,
      exportProductsCSV,
      exportProjectsCSV,
      exportTransactionsCSV,
      importClientsCSV,
      importProductsCSV,
      importProjectsCSV,
      importTransactionsCSV,
      getDashboardStats
    }}>
      {children}
    </AppContext.Provider>
  );
};