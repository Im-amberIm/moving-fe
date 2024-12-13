"use client";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { profileSchema, ProfileFormData } from "@/utils/authValidation";
import { useRouter } from "next/navigation";
import Textarea from "@/components/common/Textarea";
import CheckboxChip from "@/components/common/checkboxs/CheckboxChip";
import Image from "next/image";
import assets from "@/variables/images";
import { REGION_CODES, REGION_TEXTS } from "@/variables/regions";
import { SERVICE_CODES, SERVICE_TEXTS } from "@/variables/service";
import toast from "react-hot-toast";

interface ProfileProps {
  isUser: boolean;
  isEdit: boolean;
  userData?: {
    nickname?: string;
    career?: string;
    introduction?: string;
    description?: string;
    services?: number[];
    regions?: number[];
    imageUrl?: string;
  };
}

const styles = {
  container: `relative flex flex-col items-center w-full`,
  form: `flex flex-col gap-[0px] w-full mt-[16px] mb-[32px] pt-[20px] border-t-[1px] border-solid border-line-200`,
  formItem: `flex flex-col gap-[8px] border-b-[1px] border-solid border-line-100 pb-[20px] w-full mb-[20px]`,
  formLabel: `text-lg text-black-400 font-semibold pc:text-xl`,
  buttonContainer: `flex flex-col gap-[8px] mt-[24px] pc:flex-row-reverse pc:gap-[32px] w-full`,
  title: `w-full text-2lg font-bold text-black-400 pc:text-3xl pc:font-semibold`,
  errorMessage: `text-pr-red-200 text-sm font-regular mt-2 pc:mt-8`,
  serviceText: `mt-2 text-xs text-grayscale-400 pc:text-lg`,
};

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  disabled = false,
  className = "",
}: {
  label: string | React.ReactNode;
  name: keyof ProfileFormData;
  type?: string;
  placeholder: string;
  register: any;
  error?: string;
  disabled?: boolean;
  className?: string;
}) => (
  <div className={styles.formItem}>
    <label htmlFor={name} className={styles.formLabel}>
      {label}
      {(name === "services" || name === "regions") && (
        <span className="text-pr-blue-300 text-lg font-semibold">*</span>
      )}{" "}
      <span className="text-pr-blue-300 text-lg font-semibold">*</span>
    </label>
    <Input
      {...register(name)}
      type={type}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      className={className}
    />
  </div>
);

export default function Profile({ isUser, isEdit, userData }: ProfileProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    setError,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema(isUser)),
    mode: "onChange",
    defaultValues: {
      nickname: userData?.nickname ?? "",
      career: userData?.career ?? undefined,
      introduction: userData?.introduction ?? "",
      description: userData?.description ?? "",
      services: userData?.services ?? [],
      regions: userData?.regions ?? [],
      imageUrl: userData?.imageUrl ?? "",
    },
  });

  const values = watch();
  const [previewImage, setPreviewImage] = React.useState<string>(
    userData?.imageUrl || assets.images.imagePlaceholder
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getErrorMessage = (fieldName: keyof ProfileFormData) => {
    const value = values[fieldName];
    return Array.isArray(value)
      ? errors[fieldName]?.message
      : typeof value === "string"
      ? value.trim()
        ? errors[fieldName]?.message
        : undefined
      : errors[fieldName]?.message;
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (isUser && (data.regions.length < 1 || data.regions.length > 3)) {
      setError("regions", {
        type: "manual",
        message: "1개 이상 3개 이하로 선택해주세요.",
      });
      return;
    }
    if (!isUser && (data.regions.length === 0 || data.regions.length > 5)) {
      setError("regions", {
        type: "manual",
        message: "1개 이상 5개 이하로 선택해주세요.",
      });
      return;
    }
    if (previewImage === assets.images.imagePlaceholder) {
      setError("imageUrl", {
        type: "manual",
        message: "이미지를 선택해주세요.",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "services" || key === "regions") {
          formData.append(key, JSON.stringify(value));
        } else if (value && typeof value === "string" && key !== "imageUrl") {
          formData.append(key, value);
        }
      });

      if (fileInputRef.current?.files?.[0]) {
        formData.append("imageUrl", fileInputRef.current.files[0]);
      }

      // 테스트 확인 코드
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      if (isEdit) {
        console.log(`${isUser ? "사용자" : "기사"} 폼 수정 제출`);
        isUser ? router.push("/find-mover") : router.push("/mover/mypage");
        toast.success("프로필 수정이 완료되었습니다.", {
          duration: 3000,
          position: "bottom-center",
          icon: "👏",
        });
      } else {
        console.log(`${isUser ? "사용자" : "기사"} 폼 등록 제출`);
        isUser ? router.push("/find-mover") : router.push("/mover/request");
        toast.success("프로필 등록이 완료되었습니다.", {
          duration: 3000,
          position: "bottom-center",
          icon: "🎉",
        });
      }
      reset();
      fileInputRef.current && (fileInputRef.current.value = "");
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 선택할 수 있습니다.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setValue("imageUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const isRequiredFieldsFilled = () => {
    return values.description?.trim() !== "";
  };

  const isFormValid = !hasErrors && (!isUser ? isRequiredFieldsFilled() : true);

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        {!isUser && "기사님 "}
        {isEdit ? "프로필 수정" : "프로필 등록"}
      </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`pc:flex pc:flex-row pc:gap-[72px] ${
            isUser ? "pc:flex-col pc:gap-[0px]" : ""
          }`}
        >
          <div className="pc:flex pc:flex-col pc:w-full">
            {!isUser && (
              <FormField
                label="별명"
                name="nickname"
                placeholder="사이트에 노출될 이름을 입력해 주세요"
                register={register}
                error={getErrorMessage("nickname")}
              />
            )}
            <div className={styles.formItem}>
              <label className={styles.formLabel} htmlFor="profileImage">
                프로필 이미지{" "}
                <span className="text-pr-blue-300 text-lg font-semibold">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Image
                  src={previewImage}
                  alt="profile"
                  width={100}
                  height={100}
                  onClick={handleProfileImageClick}
                  className="cursor-pointer w-[100px] h-[100px] rounded-md"
                />
                {isEdit && (
                  <Image
                    src={assets.icons.pencil}
                    className="absolute left-[72px] top-[5px] bg-white border-gray-300 border-solid border-[1.5px] rounded-md p-[3px]"
                    width={22}
                    height={22}
                    alt="pencil"
                  />
                )}
              </div>
              {errors.imageUrl && (
                <p className={styles.errorMessage}>{errors.imageUrl.message}</p>
              )}
            </div>
            {!isUser && (
              <>
                <FormField
                  label="경력"
                  name="career"
                  placeholder="기사님의 경력을 입력해 주세요"
                  register={register}
                  error={getErrorMessage("career")}
                />
                <FormField
                  label="소개"
                  name="introduction"
                  placeholder="한 줄 소개를 입력해 주세요"
                  register={register}
                  error={getErrorMessage("introduction")}
                />
                <div
                  className={`${styles.formItem} border-none pc:pb-[0px] pc:mb-[0px] hidden pc:flex`}
                >
                  <label className={styles.formLabel} htmlFor="description">
                    상세 설명
                  </label>
                  <Textarea
                    {...register("description")}
                    placeholder="상세 내용을 입력해 주세요"
                    error={getErrorMessage("description")}
                    value={values.description}
                    onChange={(value) => {
                      setValue("description", value, { shouldValidate: true });
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="pc:flex pc:flex-col pc:w-full">
            <div
              className={`${styles.formItem} ${errors.services && "gap-[2px]"}`}
            >
              <label className={styles.formLabel} htmlFor="services">
                {isUser ? "이용 서비스" : "제공 서비스"}{" "}
                <span className="text-pr-blue-300 text-lg font-semibold">
                  *
                </span>
                {isUser && (
                  <p className={styles.serviceText}>
                    *이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
                  </p>
                )}
              </label>
              <div className="flex flex-row flex-wrap gap-[6px] mt-2 pc:mt-8">
                {Object.values(SERVICE_CODES).map((code) => (
                  <CheckboxChip
                    key={code}
                    text={SERVICE_TEXTS[code]}
                    state={values.services.includes(code)}
                    onStateChange={(checked: boolean) => {
                      let newServices: number[];
                      if (code === 99) {
                        newServices = checked
                          ? Object.values(SERVICE_CODES)
                          : [];
                      } else {
                        newServices = checked
                          ? [...values.services, code]
                          : values.services.filter(
                              (service) => service !== code
                            );
                        if (newServices.length == 3) {
                          if (!newServices.includes(99)) {
                            newServices.push(99);
                          }
                        }
                        if (
                          newServices.includes(99) &&
                          newServices.length < 4
                        ) {
                          newServices = newServices.filter(
                            (service) => service !== 99
                          );
                        }
                      }
                      setValue("services", newServices, {
                        shouldValidate: true,
                      });
                    }}
                  />
                ))}
              </div>
              {errors.services && (
                <p className={styles.errorMessage}>{errors.services.message}</p>
              )}
            </div>
            <div
              className={`${styles.formItem} ${
                errors.regions && "gap-[2px]"
              } pc:border-none`}
            >
              <label className={styles.formLabel} htmlFor="services">
                {isUser ? "내가 사는 지역" : "서비스 가능 지역"}{" "}
                <span className="text-pr-blue-300 text-lg font-semibold">
                  *
                </span>
                {isUser && (
                  <p className={styles.serviceText}>
                    *내가 사는 지역은 언제든 수정 가능해요!
                  </p>
                )}
              </label>
              <div className="flex flex-row flex-wrap gap-[8px] w-[277px] mt-2 pc:mt-8 pc:w-[416px]">
                {Object.values(REGION_CODES).map((code) => (
                  <CheckboxChip
                    key={code}
                    text={REGION_TEXTS[code]}
                    state={values.regions.includes(code)}
                    onStateChange={(checked: boolean) => {
                      let newRegions: number[];
                      newRegions = checked
                        ? [...values.regions, code]
                        : values.regions.filter((region) => region !== code);
                      setValue("regions", newRegions, { shouldValidate: true });
                    }}
                  />
                ))}
              </div>
              {errors.regions && (
                <p className={styles.errorMessage}>{errors.regions.message}</p>
              )}
            </div>
          </div>
        </div>
        {!isUser && (
          <div
            className={`${styles.formItem} border-none pb-[0px] mb-[0px] pc:hidden`}
          >
            <label className={styles.formLabel} htmlFor="description">
              상세 설명{" "}
              <span className="text-pr-blue-300 text-lg font-semibold">*</span>
            </label>
            <Textarea
              {...register("description")}
              placeholder="상세 내용을 입력해 주세요"
              error={getErrorMessage("description")}
              value={values.description}
              onChange={(value) => {
                setValue("description", value, { shouldValidate: true });
              }}
            />
          </div>
        )}
        <div className={styles.buttonContainer}>
          <Button
            children={isEdit ? "수정하기" : "시작하기"}
            type="submit"
            variant="primary"
            className="flex-1 text-center"
            disabled={!isFormValid}
          />
          {isEdit && (
            <Button
              children="취소"
              variant="outlined"
              className="flex-1 text-center"
              onClick={() => router.push("/")}
            />
          )}
        </div>
      </form>
    </div>
  );
}
