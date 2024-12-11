using AutoMapper;
using BussinessObject.Models;
namespace BussinessObject.Dto
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {

            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User != null ? src.User.Username : null))
                .ReverseMap();


            CreateMap<OrderDetail, OrderDetailDTO>()
            .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId))
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductName : null))
            .ReverseMap();


            CreateMap<Product, ProductDTO>()
             .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
             .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId))
             .ReverseMap();


            CreateMap<Role, RoleDTO>().ReverseMap();

            CreateMap<Supplier, SupplierDTO>().ReverseMap();
            CreateMap<User, UserDTO>()
            .ReverseMap();
            CreateMap<User, UserProfileDto>()
           .ReverseMap();
            CreateMap<User, LoginDTO>()
           .ReverseMap();
            CreateMap<User, RegisterDTO>()
           .ReverseMap();
            CreateMap<Warehouse, WarehouseDTO>().ReverseMap();
            CreateMap<WarehouseProduct, WarehouseProductDTO>()
                .ForMember(dest => dest.Warehouse, opt => opt.MapFrom(src => src.Warehouse))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .ReverseMap();








        }
    }
}
